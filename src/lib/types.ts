export type Employee = {
  id: string;
  fullName: string;
  address: string;
  department: 'Engineering' | 'HR' | 'Marketing' | 'Sales' | 'Finance';
  avatarUrl: string;
};

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'late';

export type AttendanceRecord = {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
};

export type PerformanceReview = {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  summary: string;
};

export type AIInsight = {
  id: string;
  employeeId: string;
  summary: string;
  insights: string[];
  areasForDevelopment: string[];
  createdAt: string; // ISO 8601
};
