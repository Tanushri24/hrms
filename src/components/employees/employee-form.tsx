'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createEmployeeAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const initialState = {
  message: '',
  errors: {
    fullName: [],
    address: [],
    department: [],
  },
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Adding Employee...' : 'Add Employee'}
    </Button>
  );
}

export function EmployeeForm() {
  const [state, formAction] = useFormState(createEmployeeAction, initialState);

  return (
    <form action={formAction} className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" placeholder="e.g. John Doe" required />
        {state.errors?.fullName && (
          <p className="text-sm text-destructive">{state.errors.fullName.join(', ')}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" placeholder="e.g. 123 Main St, Anytown, USA" required />
         {state.errors?.address && (
          <p className="text-sm text-destructive">{state.errors.address.join(', ')}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select name="department" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
          </SelectContent>
        </Select>
        {state.errors?.department && (
          <p className="text-sm text-destructive">{state.errors.department.join(', ')}</p>
        )}
      </div>

      {state.message && !state.errors && (
         <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <SubmitButton />
    </form>
  );
}
