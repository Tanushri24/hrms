'use client';

import { useState, useTransition, useRef } from 'react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addReviewAction } from '@/lib/actions';
import type { PerformanceReview } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

export function PerformanceManager({
  employeeId,
  reviews,
}: {
  employeeId: string;
  reviews: PerformanceReview[];
}) {
  const [summary, setSummary] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      toast({
        title: 'Error',
        description: 'Review summary cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    startTransition(async () => {
      const result = await addReviewAction(employeeId, summary);
      toast({
        title: 'Success',
        description: result.message,
      });
      if (result.message === 'Performance review added.') {
        setSummary('');
        formRef.current?.reset();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Add New Review</h3>
        <form onSubmit={handleAddReview} ref={formRef} className="space-y-4">
          <Textarea
            placeholder="Write a summary of the performance review..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Adding Review...' : 'Add Review'}
          </Button>
        </form>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-2">Past Reviews</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {reviews.length > 0 ? (
            reviews.map((review) => (
                <Card key={review.id} className="bg-secondary/50">
                    <CardHeader className="p-4">
                        <CardDescription>{format(new Date(review.date), 'PPP')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-sm">{review.summary}</p>
                    </CardContent>
                </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No performance reviews found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
