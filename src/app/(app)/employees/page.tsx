import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { getEmployees } from '@/lib/data';
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
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { DeleteEmployeeButton } from '@/components/employees/delete-employee-button';

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Employees"
        description="Manage your team members and view their details."
        actions={
          <Link href="/employees/add" passHref>
            <Button>
              <PlusCircle className="mr-2" />
              Add Employee
            </Button>
          </Link>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>
            A list of all employees in your organization.
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
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length > 0 ? (
                  employees.map((employee) => (
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
                      <TableCell className="text-muted-foreground">
                        {employee.address}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Link href={`/employees/${employee.id}`} passHref>
                                <Button variant="outline" size="sm">View</Button>
                            </Link>
                            <DeleteEmployeeButton employeeId={employee.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
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
