'use server';
/**
 * @fileOverview Recipe suggestion based on pantry ingredients.
 *
 * - suggestRecipes - A function that suggests recipes based on available ingredients.
 * - SuggestRecipesInput - The input type for the suggestRecipes function.
 * - SuggestRecipesOutput - The return type for the suggestRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipesInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients available in the pantry.'),
  dietaryRestrictions: z
    .array(z.string())
    .optional()
    .describe('Dietary restrictions to consider when suggesting recipes.'),
});
export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

const SuggestRecipesOutputSchema = z.object({
  recipes: z
    .array(z.string())
    .describe('A list of suggested recipe names based on the ingredients.'),
});
export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(input: SuggestRecipesInput): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {schema: SuggestRecipesInputSchema},
  output: {schema: SuggestRecipesOutputSchema},
  prompt: `Suggest recipes based on the following ingredients:

Ingredients: {{#each ingredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

{{#if dietaryRestrictions}}
Dietary Restrictions: {{#each dietaryRestrictions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

Please provide a list of recipe names that can be made with these ingredients, considering any dietary restrictions.
`,
});

const suggestRecipesFlow = ai.defineFlow(
  {
    name: 'suggestRecipesFlow',
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
