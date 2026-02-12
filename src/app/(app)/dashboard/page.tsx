import Link from 'next/link';
import { PlusCircle, Users, BarChart2 } from 'lucide-react';
import { getEmployees } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';

export default async function DashboardPage() {
  const employees = await getEmployees();
  const totalEmployees = employees.length;

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back, Admin! Here's a quick overview of your organization."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Currently active in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Today
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">
              +2% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                <CardDescription>Get started with common tasks.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
                <Link href="/employees/add" passHref>
                    <Button className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Employee
                    </Button>
                </Link>
            </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Welcome to HRMS Lite</CardTitle>
          <CardDescription>
            This is your central hub for managing employees, tracking attendance, and gaining valuable insights with our intelligent assistant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Navigate using the sidebar to explore different modules. You can start by viewing the list of employees or adding a new one.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
