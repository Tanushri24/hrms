'use client';

import { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { markAttendanceAction } from '@/lib/actions';
import type { AttendanceRecord, AttendanceStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

export function AttendanceManager({
  employeeId,
  records,
}: {
  employeeId: string;
  records: AttendanceRecord[];
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<AttendanceStatus>('present');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleMarkAttendance = () => {
    if (!date) {
      toast({
        title: 'Error',
        description: 'Please select a date.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const result = await markAttendanceAction(employeeId, date, status);
      toast({
        title: 'Success',
        description: result.message,
      });
    });
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
        case 'present': return 'bg-green-500';
        case 'absent': return 'bg-red-500';
        case 'late': return 'bg-yellow-500';
        case 'leave': return 'bg-blue-500';
        default: return 'bg-gray-500';
    }
  }

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
            <div>
                <h3 className="font-medium mb-2">Mark New Attendance</h3>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md"
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    />
                </div>
            </div>
            <div className="space-y-4">
                 <h3 className="font-medium mb-2">Details</h3>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Date: {date ? format(date, 'PPP') : 'None selected'}</p>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={status} onValueChange={(value) => setStatus(value as AttendanceStatus)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                            <SelectItem value="leave">On Leave</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleMarkAttendance} disabled={isPending || !date}>
                    {isPending ? 'Saving...' : 'Save Attendance'}
                </Button>
            </div>
        </div>
        
        <Separator />
        
        <div>
            <h3 className="font-medium mb-2">Attendance History</h3>
            <div className="rounded-md border max-h-64 overflow-y-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.length > 0 ? (
                            records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{format(new Date(record.date), 'PPP')}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("text-white", getStatusColor(record.status))}>{record.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center">
                                    No attendance records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
  );
}
