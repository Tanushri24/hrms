
import type { Employee, AttendanceRecord, PerformanceReview, AIInsight, AttendanceStatus } from './types';
import { placeholderImages } from './placeholder-images.json';
import { format } from 'date-fns';

// In-memory store that persists across HMR in development
declare global {
  var __inMemoryData__: {
    employees: Employee[];
    attendance: AttendanceRecord[];
    reviews: PerformanceReview[];
    insights: AIInsight[];
  } | undefined
}

if (!global.__inMemoryData__) {
  global.__inMemoryData__ = {
    employees: [
      { id: '1', fullName: 'Jane Doe', address: '123 Maple Street, Springfield', department: 'Engineering', avatarUrl: placeholderImages[0].imageUrl },
      { id: '2', fullName: 'John Smith', address: '456 Oak Avenue, Metropolis', department: 'Marketing', avatarUrl: placeholderImages[1].imageUrl },
      { id: '3', fullName: 'Alice Johnson', address: '789 Pine Lane, Gotham', department: 'Sales', avatarUrl: placeholderImages[2].imageUrl },
    ],
    attendance: [
      { id: 'a1', employeeId: '1', date: '2024-07-20', status: 'present' },
      { id: 'a2', employeeId: '1', date: '2024-07-21', status: 'absent' },
      { id: 'a3', employeeId: '2', date: '2024-07-20', status: 'present' },
    ],
    reviews: [
      { id: 'r1', employeeId: '1', date: '2024-06-01', summary: 'Exceeded expectations on the recent project, showing great leadership.' },
    ],
    insights: [],
  }
}

const db = global.__inMemoryData__;

// Helper to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Employee Functions
export async function getEmployees(): Promise<Employee[]> {
  await delay(100);
  return [...db.employees];
}

export async function getEmployeeById(id: string): Promise<Employee | undefined> {
  await delay(100);
  return db.employees.find(e => e.id === id);
}

export async function addEmployee(employeeData: Omit<Employee, 'id' | 'avatarUrl'>): Promise<Employee> {
  await delay(200);
  const newEmployee: Employee = {
    ...employeeData,
    id: String(Date.now()),
    avatarUrl: placeholderImages[Math.floor(Math.random() * placeholderImages.length)].imageUrl,
  };
  db.employees.push(newEmployee);
  return newEmployee;
}

export async function deleteEmployee(id: string): Promise<void> {
  await delay(200);
  db.employees = db.employees.filter(e => e.id !== id);
  db.attendance = db.attendance.filter(a => a.employeeId !== id);
  db.reviews = db.reviews.filter(r => r.employeeId !== id);
  db.insights = db.insights.filter(i => i.employeeId !== id);
}

// Attendance Functions
export async function getAllAttendance(): Promise<AttendanceRecord[]> {
  await delay(100);
  return [...db.attendance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAttendanceByEmployee(employeeId: string): Promise<AttendanceRecord[]> {
  await delay(100);
  return db.attendance.filter(a => a.employeeId === employeeId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function markAttendance(employeeId: string, date: Date, status: AttendanceStatus): Promise<AttendanceRecord> {
  await delay(200);
  const dateString = format(date, 'yyyy-MM-dd');
  const existingRecord = db.attendance.find(a => a.employeeId === employeeId && a.date === dateString);
  if (existingRecord) {
    existingRecord.status = status;
    return existingRecord;
  }
  const newRecord: AttendanceRecord = {
    id: String(Date.now()),
    employeeId,
    date: dateString,
    status,
  };
  db.attendance.push(newRecord);
  return newRecord;
}

// Performance Review Functions
export async function getReviewsByEmployee(employeeId: string): Promise<PerformanceReview[]> {
    await delay(100);
    return db.reviews.filter(r => r.employeeId === employeeId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addReview(employeeId: string, summary: string): Promise<PerformanceReview> {
    await delay(200);
    const newReview: PerformanceReview = {
        id: String(Date.now()),
        employeeId,
        date: format(new Date(), 'yyyy-MM-dd'),
        summary,
    };
    db.reviews.push(newReview);
    return newReview;
}

// AI Insight Functions
export async function getInsightsByEmployee(employeeId: string): Promise<AIInsight[]> {
    await delay(100);
    return db.insights.filter(i => i.employeeId === employeeId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addInsight(employeeId: string, insightData: Omit<AIInsight, 'id' | 'employeeId' | 'createdAt'>): Promise<AIInsight> {
    await delay(200);
    const newInsight: AIInsight = {
        ...insightData,
        id: String(Date.now()),
        employeeId,
        createdAt: new Date().toISOString(),
    };
    db.insights.push(newInsight);
    return newInsight;
}
