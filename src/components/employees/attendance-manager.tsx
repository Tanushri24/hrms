'use client';

import { useState, useTransition, useEffect } from 'react';
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
  const [localRecords, setLocalRecords] = useState(records);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<AttendanceStatus>('present');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    setLocalRecords(records);
  }, [records]);

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

      // Optimistically update local state
      const dateString = format(date, 'yyyy-MM-dd');
      const existingRecordIndex = localRecords.findIndex(r => r.date === dateString);
      if (existingRecordIndex > -1) {
          const updatedRecords = [...localRecords];
          updatedRecords[existingRecordIndex] = { ...updatedRecords[existingRecordIndex], status };
          setLocalRecords(updatedRecords);
      } else {
          const newRecord = { id: Date.now().toString(), employeeId, date: dateString, status };
          const updatedRecords = [...localRecords, newRecord].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setLocalRecords(updatedRecords);
      }
    });
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
        case 'present': return 'bg-chart-2 text-white';
        case 'absent': return 'bg-destructive text-destructive-foreground';
        case 'late': return 'bg-chart-4 text-black';
        case 'leave': return 'bg-primary text-primary-foreground';
        default: return 'bg-muted text-muted-foreground';
    }
  }

  const parseDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const attendanceModifiers = {
    present: localRecords.filter(r => r.status === 'present').map(r => parseDate(r.date)),
    absent: localRecords.filter(r => r.status === 'absent').map(r => parseDate(r.date)),
    late: localRecords.filter(r => r.status === 'late').map(r => parseDate(r.date)),
    leave: localRecords.filter(r => r.status === 'leave').map(r => parseDate(r.date)),
  };

  const modifierStyles = {
    present: { backgroundColor: 'hsl(var(--chart-2))', color: 'hsl(var(--primary-foreground))', opacity: 0.8 },
    absent: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))', opacity: 0.8 },
    late: { backgroundColor: 'hsl(var(--chart-4))', color: 'hsl(var(--foreground))', opacity: 0.8 },
    leave: { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', opacity: 0.8 },
  };

  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    modifiers={attendanceModifiers}
                    modifiersStyles={modifierStyles}
                />
            </div>
            <div className="space-y-4">
                 <h3 className="font-medium">Details</h3>
                <div className="space-y-2">
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{date ? format(date, 'PPP') : 'None selected'}</p>
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
                        {localRecords.length > 0 ? (
                            localRecords.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{format(parseDate(record.date), 'PPP')}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("capitalize", getStatusColor(record.status))}>{record.status}</Badge>
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
