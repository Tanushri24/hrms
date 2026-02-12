'use server';
/**
 * @fileOverview A Genkit flow for an AI assistant to summarize an individual employee's overall profile.
 *
 * - summarizeEmployeeOverview - A function that handles the employee overview summarization process.
 * - SummarizeEmployeeOverviewInput - The input type for the summarizeEmployeeOverview function.
 * - SummarizeEmployeeOverviewOutput - The return type for the summarizeEmployeeOverview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEmployeeOverviewInputSchema = z.object({
  fullName: z.string().describe("The employee's full name."),
  address: z.string().describe("The employee's home address."),
  department: z.string().describe("The department the employee works in."),
  attendanceRecords: z
    .array(
      z.object({
        date: z.string().describe('The date of the attendance record (YYYY-MM-DD).'),
        status: z.enum(['present', 'absent', 'leave']).describe('The attendance status for the day.'),
      })
    )
    .describe('A list of attendance records for the employee.'),
  performanceReviews: z
    .array(
      z.object({
        date: z
          .string()
          .describe('The date of the performance review (YYYY-MM-DD).'),
        summary: z.string().describe('A summary of the performance review.'),
      })
    )
    .describe('A list of performance reviews for the employee.'),
});
export type SummarizeEmployeeOverviewInput = z.infer<
  typeof SummarizeEmployeeOverviewInputSchema
>;

const SummarizeEmployeeOverviewOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the employee's overall profile."),
});
export type SummarizeEmployeeOverviewOutput = z.infer<
  typeof SummarizeEmployeeOverviewOutputSchema
>;

export async function summarizeEmployeeOverview(
  input: SummarizeEmployeeOverviewInput
): Promise<SummarizeEmployeeOverviewOutput> {
  return summarizeEmployeeOverviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEmployeeOverviewPrompt',
  input: {schema: SummarizeEmployeeOverviewInputSchema},
  output: {schema: SummarizeEmployeeOverviewOutputSchema},
  prompt: `You are an intelligent HR assistant tasked with summarizing an employee's overall profile.

Generate a concise summary of the employee's information, attendance trends, and performance. Highlight key strengths, areas for improvement, and any notable patterns.

Employee Information:
- Full Name: {{{fullName}}}
- Address: {{{address}}}
- Department: {{{department}}}

Attendance Records (most recent 5, if available):
{{#if attendanceRecords}}
  {{#each (attendanceRecords.slice 0 5)}}
- Date: {{{date}}}, Status: {{{status}}}
  {{/each}}
{{else}}
No attendance records available.
{{/if}}

Performance Reviews (most recent 3, if available):
{{#if performanceReviews}}
  {{#each (performanceReviews.slice 0 3)}}
- Date: {{{date}}}, Summary: {{{summary}}}
  {{/each}}
{{else}}
No performance reviews available.
{{/if}}

Provide an overall summary that is easy to understand and provides a quick overview for an HR admin. The summary should be approximately 3-5 sentences long.
`,
});

const summarizeEmployeeOverviewFlow = ai.defineFlow(
  {
    name: 'summarizeEmployeeOverviewFlow',
    inputSchema: SummarizeEmployeeOverviewInputSchema,
    outputSchema: SummarizeEmployeeOverviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
