
import { getEmployees, getAllAttendance } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { AttendanceStatus } from '@/lib/types';

const getStatusColor = (status: AttendanceStatus | 'Not Marked') => {
    switch (status) {
        case 'present': return 'bg-green-500';
        case 'absent': return 'bg-red-500';
        case 'late': return 'bg-yellow-500';
        case 'leave': return 'bg-blue-500';
        default: return 'bg-gray-400';
    }
}

export default async function AttendancePage() {
  const [employees, allAttendance] = await Promise.all([
    getEmployees(),
    getAllAttendance(),
  ]);

  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');

  const attendanceToday = employees.map(employee => {
    const record = allAttendance.find(a => a.employeeId === employee.id && a.date === todayString);
    return {
      ...employee,
      status: record?.status ?? 'Not Marked',
    };
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Attendance Overview"
        description={`Attendance status for ${format(today, 'PPP')}`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>
            A summary of employee attendance for the current day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceToday.length > 0 ? (
                  attendanceToday.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={employee.avatarUrl} alt={employee.fullName} data-ai-hint="person portrait" />
                          <AvatarFallback>
                            {employee.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {employee.fullName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{employee.department}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={cn("text-white capitalize", getStatusColor(employee.status as AttendanceStatus | 'Not Marked'))}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No employees found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
