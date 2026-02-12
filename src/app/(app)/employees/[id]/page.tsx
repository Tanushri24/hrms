import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, User, MapPin, Building, CalendarDays, Star, Bot } from 'lucide-react';
import { getEmployeeById, getAttendanceByEmployee, getReviewsByEmployee, getInsightsByEmployee } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AttendanceManager } from '@/components/employees/attendance-manager';
import { PerformanceManager } from '@/components/employees/performance-manager';
import { AiAssistant } from '@/components/employees/ai-assistant';
import { format } from 'date-fns';

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const employee = await getEmployeeById(params.id);
  
  if (!employee) {
    notFound();
  }

  const [attendanceRecords, performanceReviews, aiInsights] = await Promise.all([
    getAttendanceByEmployee(params.id),
    getReviewsByEmployee(params.id),
    getInsightsByEmployee(params.id),
  ]);

  return (
    <div className="grid gap-6">
      <PageHeader
        title={employee.fullName}
        description={`Details for ${employee.fullName}`}
        actions={
          <Link href="/employees" passHref>
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Employees
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20 border">
                <AvatarImage src={employee.avatarUrl} alt={employee.fullName} data-ai-hint="person portrait" />
                <AvatarFallback>{employee.fullName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{employee.fullName}</CardTitle>
                <CardDescription>
                    <Badge variant="secondary">{employee.department}</Badge>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.fullName}</span>
                </div>
                <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.address}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.department} Department</span>
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Assistant
                </CardTitle>
                <CardDescription>Get AI-powered insights and summaries.</CardDescription>
            </CardHeader>
            <CardContent>
                <AiAssistant employeeId={employee.id} savedInsights={aiInsights} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />Attendance</CardTitle>
                    <CardDescription>Mark and view attendance records.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AttendanceManager employeeId={employee.id} records={attendanceRecords} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" />Performance</CardTitle>
                    <CardDescription>Manage and view performance reviews.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PerformanceManager employeeId={employee.id} reviews={performanceReviews} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
