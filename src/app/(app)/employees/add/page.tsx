import { PageHeader } from '@/components/page-header';
import { EmployeeForm } from '@/components/employees/employee-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AddEmployeePage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Add New Employee"
        description="Fill in the details below to add a new team member."
      />
      <Card>
        <CardHeader>
            <CardTitle>Employee Information</CardTitle>
            <CardDescription>Please provide the required information for the new employee.</CardDescription>
        </CardHeader>
        <CardContent>
            <EmployeeForm />
        </CardContent>
      </Card>
    </div>
  );
}
