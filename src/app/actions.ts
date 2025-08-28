'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Recipe } from '@/types';

const RecipeSchema = z.object({
  name: z.string().describe('The name of the recipe.'),
  description: z.string().describe('A brief, enticing description of the dish, around 2-3 sentences.'),
  prepTime: z.string().describe('Preparation time, e.g., "15 minutes".'),
  cookTime: z.string().describe('Cooking time, e.g., "25 minutes".'),
  servings: z.string().describe('Number of servings the recipe makes, e.g., "4 servings".'),
  ingredients: z.array(z.string()).describe('A list of ingredients with quantities and units.'),
  instructions: z.array(z.string()).describe('Step-by-step cooking instructions.'),
});

export async function getRecipeDetails(recipeName: string): Promise<Recipe> {
  try {
    const { output } = await ai.generate({
      prompt: `Generate a detailed but straightforward recipe for "${recipeName}". Ensure the description is engaging. Follow the specified format exactly.`,
      model: 'googleai/gemini-1.5-flash',
      output: {
        schema: RecipeSchema,
      },
      config: {
        temperature: 0.3,
      },
    });

    if (!output) {
      throw new Error('Failed to generate recipe details from AI.');
    }
    return output;
  } catch (error) {
    console.error(`Error generating recipe for ${recipeName}:`, error);
    // In a real app, you might want to return a more user-friendly error or a fallback object
    throw new Error(`Could not generate details for ${recipeName}.`);
  }
}
