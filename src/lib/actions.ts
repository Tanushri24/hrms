'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addEmployee, deleteEmployee, markAttendance, addReview, addInsight, getEmployeeById, getAttendanceByEmployee, getReviewsByEmployee } from './data';
import type { AttendanceStatus, PerformanceReview as PerformanceReviewType } from './types';
import { summarizeEmployeeOverview } from '@/ai/flows/summarize-employee-overview-flow';
import { identifyEmployeeInsights } from '@/ai/flows/identify-employee-insights-flow';

const employeeSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters long.'),
  address: z.string().min(5, 'Address must be at least 5 characters long.'),
  department: z.enum(['Engineering', 'HR', 'Marketing', 'Sales', 'Finance']),
});

export async function createEmployeeAction(prevState: any, formData: FormData) {
  const validatedFields = employeeSchema.safeParse({
    fullName: formData.get('fullName'),
    address: formData.get('address'),
    department: formData.get('department'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check the fields and try again.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await addEmployee(validatedFields.data);
  } catch (e) {
    return { message: 'Failed to create employee.' };
  }

  revalidatePath('/employees');
  redirect('/employees');
}

export async function deleteEmployeeAction(employeeId: string) {
    try {
        await deleteEmployee(employeeId);
        revalidatePath('/employees');
        return { message: 'Employee deleted successfully.' };
    } catch (e) {
        return { message: 'Failed to delete employee.' };
    }
}

export async function markAttendanceAction(employeeId: string, date: Date, status: AttendanceStatus) {
    try {
        await markAttendance(employeeId, date, status);
        revalidatePath(`/employees/${employeeId}`);
        revalidatePath('/attendance');
        return { message: `Attendance marked as ${status}.` };
    } catch (e) {
        return { message: 'Failed to mark attendance.' };
    }
}

export async function addReviewAction(employeeId: string, summary: string) {
    if (!summary.trim()) {
        return { message: 'Review summary cannot be empty.' };
    }
    try {
        await addReview(employeeId, summary);
        revalidatePath(`/employees/${employeeId}`);
        return { message: 'Performance review added.' };
    } catch (e) {
        return { message: 'Failed to add review.' };
    }
}

export async function getEmployeeSummaryAction(employeeId: string) {
    try {
        const employee = await getEmployeeById(employeeId);
        const attendance = await getAttendanceByEmployee(employeeId);
        const reviews = await getReviewsByEmployee(employeeId);

        if (!employee) {
            return { error: 'Employee not found.' };
        }

        const summary = await summarizeEmployeeOverview({
            fullName: employee.fullName,
            address: employee.address,
            department: employee.department,
            attendanceRecords: attendance.map(a => ({ date: a.date, status: a.status as 'present' | 'absent' | 'leave' })),
            performanceReviews: reviews.map(r => ({ date: r.date, summary: r.summary })),
        });

        return { data: summary };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to generate summary.' };
    }
}

export async function getEmployeeInsightsAction(employeeId: string) {
    try {
        const employee = await getEmployeeById(employeeId);
        const attendance = await getAttendanceByEmployee(employeeId);
        const reviews = await getReviewsByEmployee(employeeId);

        if (!employee) {
            return { error: 'Employee not found.' };
        }

        const insights = await identifyEmployeeInsights({
            employeeName: employee.fullName,
            attendanceRecords: attendance.map(a => ({date: a.date, status: a.status as 'present' | 'absent' | 'late'})),
            performanceReviews: reviews.map(r => r.summary),
        });

        return { data: insights };

    } catch (error) {
        console.error(error);
        return { error: 'Failed to generate insights.' };
    }
}

export async function saveInsightsAction(employeeId: string, insightsData: { summary: string; insights: string[]; areasForDevelopment: string[] }) {
    try {
        await addInsight(employeeId, insightsData);
        revalidatePath(`/employees/${employeeId}`);
        return { message: 'Insights saved successfully.' };
    } catch (error) {
        return { message: 'Failed to save insights.' };
    }
}
