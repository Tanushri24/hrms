'use server';
/**
 * @fileOverview An AI assistant flow for HR to analyze an individual employee's historical data.
 *
 * - identifyEmployeeInsights - A function that handles the process of identifying employee insights.
 * - IdentifyEmployeeInsightsInput - The input type for the identifyEmployeeInsights function.
 * - IdentifyEmployeeInsightsOutput - The return type for the identifyEmployeeInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyEmployeeInsightsInputSchema = z.object({
  employeeName: z.string().describe("The full name of the employee being analyzed."),
  attendanceRecords: z.array(
    z.object({
      date: z.string().describe('The date of the attendance record (e.g., "YYYY-MM-DD").'),
      status: z.enum(['present', 'absent', 'late']).describe('The attendance status for the date.'),
    })
  ).describe('A list of historical attendance records for the employee.'),
  performanceReviews: z.array(z.string()).describe('A list of summarized performance reviews for the employee.'),
});
export type IdentifyEmployeeInsightsInput = z.infer<typeof IdentifyEmployeeInsightsInputSchema>;

const IdentifyEmployeeInsightsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the employee analysis.'),
  insights: z.array(z.string()).describe('Key insights identified from the employee data, such as patterns in performance or attendance.'),
  areasForDevelopment: z.array(z.string()).describe('Specific areas where the employee could improve or develop, based on the analysis.'),
});
export type IdentifyEmployeeInsightsOutput = z.infer<typeof IdentifyEmployeeInsightsOutputSchema>;

export async function identifyEmployeeInsights(input: IdentifyEmployeeInsightsInput): Promise<IdentifyEmployeeInsightsOutput> {
  return identifyEmployeeInsightsFlow(input);
}

const identifyEmployeeInsightsPrompt = ai.definePrompt({
  name: 'identifyEmployeeInsightsPrompt',
  input: {schema: IdentifyEmployeeInsightsInputSchema},
  output: {schema: IdentifyEmployeeInsightsOutputSchema},
  prompt: `You are an intelligent HR assistant. Your task is to analyze an employee's historical data and identify key insights and areas for development.

Employee Name: {{{employeeName}}}

## Attendance Records:
Analyze the following attendance records for patterns, such as frequent absences, punctuality, or consistent presence. Note any trends like specific days of the week for absences, or periods of frequent lateness.
{{#if attendanceRecords}}
  {{#each attendanceRecords}}
    - Date: {{{this.date}}}, Status: {{{this.status}}}
  {{/each}}
{{else}}
  No attendance records available.
{{/if}}

## Performance Reviews:
Analyze the following performance review summaries to identify recurring strengths, weaknesses, and overall performance trends. Look for common feedback themes or areas consistently mentioned for improvement or commendation.
{{#if performanceReviews}}
  {{#each performanceReviews}}
    - {{{this}}}
  {{/each}}
{{else}}
  No performance reviews available.
{{/if}}

Based on the provided data, generate a concise summary of the employee analysis, key insights, and specific areas for development. Ensure the insights are actionable and the areas for development are clear and constructive.
`,
});

const identifyEmployeeInsightsFlow = ai.defineFlow(
  {
    name: 'identifyEmployeeInsightsFlow',
    inputSchema: IdentifyEmployeeInsightsInputSchema,
    outputSchema: IdentifyEmployeeInsightsOutputSchema,
  },
  async (input) => {
    const {output} = await identifyEmployeeInsightsPrompt(input);
    if (!output) {
      throw new Error('Failed to identify employee insights.');
    }
    return output;
  }
);
