'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getEmployeeSummaryAction, getEmployeeInsightsAction, saveInsightsAction } from '@/lib/actions';
import { Loader2, Lightbulb, CheckCircle } from 'lucide-react';
import { AIInsight } from '@/lib/types';
import { format } from 'date-fns';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

type SummaryData = { summary: string };
type InsightsData = { summary: string; insights: string[]; areasForDevelopment: string[] };

export function AiAssistant({ employeeId, savedInsights }: { employeeId: string, savedInsights: AIInsight[] }) {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [isSummaryLoading, startSummaryTransition] = useTransition();
  const [isInsightsLoading, startInsightsTransition] = useTransition();
  const [isSavePending, startSaveTransition] = useTransition();

  const { toast } = useToast();

  const handleGetSummary = () => {
    startSummaryTransition(async () => {
      setSummary(null);
      const result = await getEmployeeSummaryAction(employeeId);
      if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      } else {
        setSummary(result.data!);
      }
    });
  };

  const handleGetInsights = () => {
    startInsightsTransition(async () => {
      setInsights(null);
      const result = await getEmployeeInsightsAction(employeeId);
      if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      } else {
        setInsights(result.data!);
      }
    });
  };

  const handleSaveInsights = () => {
    if (!insights) return;
    startSaveTransition(async () => {
        const result = await saveInsightsAction(employeeId, insights);
        if (result.message === 'Insights saved successfully.') {
            toast({ title: 'Success', description: result.message });
            setInsights(null);
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={handleGetSummary} disabled={isSummaryLoading}>
          {isSummaryLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Summarize
        </Button>
        <Button onClick={handleGetInsights} disabled={isInsightsLoading} variant="outline">
          {isInsightsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Get Insights
        </Button>
      </div>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Employee Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{summary.summary}</p>
          </CardContent>
        </Card>
      )}

      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI-Generated Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Analysis Summary</h4>
              <p className="text-sm">{insights.summary}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Key Insights</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {insights.insights.map((insight, i) => <li key={i}>{insight}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Areas for Development</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {insights.areasForDevelopment.map((area, i) => <li key={i}>{area}</li>)}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveInsights} disabled={isSavePending} size="sm">
                {isSavePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Approve & Save Insights
            </Button>
          </CardFooter>
        </Card>
      )}

      {savedInsights.length > 0 && (
        <>
            <Separator className="my-6" />
            <div className="space-y-2">
                <h3 className="font-semibold text-sm">Saved Insights History</h3>
                 <Accordion type="single" collapsible className="w-full">
                    {savedInsights.map(insight => (
                        <AccordionItem key={insight.id} value={insight.id}>
                            <AccordionTrigger>
                                Insight from {format(new Date(insight.createdAt), 'PPP')}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4 p-2">
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Analysis Summary</h4>
                                        <p className="text-sm text-muted-foreground">{insight.summary}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Key Insights Identified</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                            {insight.insights.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Areas for Development</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                            {insight.areasForDevelopment.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </>
      )}
    </div>
  );
}
