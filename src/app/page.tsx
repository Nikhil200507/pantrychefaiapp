
'use client';

import { useState, useCallback } from 'react';
import type { Recipe } from '@/types';
import { suggestRecipes } from '@/ai/flows/suggest-recipes';
import { getRecipeDetails } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/layout/header';
import PantryManager from '@/components/pantry/pantry-manager';
import RecipeTabs from '@/components/recipes/recipe-tabs';
import RecipeDialog from '@/components/recipes/recipe-dialog';

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>(['Tomatoes', 'Basil', 'Garlic', 'Olive Oil']);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [suggestedRecipesList, setSuggestedRecipesList] = useState<string[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');

  const { toast } = useToast();

  const handleAddIngredient = () => {
    const ingredientToAdd = newIngredient.trim();
    if (ingredientToAdd && !ingredients.includes(ingredientToAdd)) {
      setIngredients([...ingredients, ingredientToAdd]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleToggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  const handleGenerateRecipes = useCallback(async () => {
    if (ingredients.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Ingredients',
        description: 'Please add some ingredients to your pantry first.',
      });
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const result = await suggestRecipes({ ingredients, dietaryRestrictions });
      setSuggestedRecipesList(result.recipes);
    } catch (error) {
      console.error('Error suggesting recipes:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate recipe suggestions. Please try again.',
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [ingredients, dietaryRestrictions, toast]);

    const handleSelectRecipe = useCallback(async (recipeName: string) => {
    const existingFavorite = favoriteRecipes.find(r => r.name === recipeName);
    if(existingFavorite) {
      setSelectedRecipe(existingFavorite);
      setIsDialogOpen(true);
      return;
    }

    setIsLoadingDetails(true);
    setIsDialogOpen(true);
    setSelectedRecipe({ name: recipeName, description: '', ingredients: [], instructions: [], prepTime: '', cookTime: '', servings: '' });

    try {
      const details = await getRecipeDetails(recipeName);
      setSelectedRecipe(details);
    } catch (error) {
      console.error('Error getting recipe details:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Could not load details for ${recipeName}.`,
      });
      setIsDialogOpen(false);
    } finally {
      setIsLoadingDetails(false);
    }
  }, [favoriteRecipes, toast]);

  const handleToggleFavorite = (recipe: Recipe) => {
    setFavoriteRecipes((prev) =>
      prev.some((r) => r.name === recipe.name)
        ? prev.filter((r) => r.name !== recipe.name)
        : [...prev, recipe]
    );
  };
  
  const isFavorite = (recipeName: string) => favoriteRecipes.some(r => r.name === recipeName);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div className="lg:col-span-1 xl:col-span-1">
            <PantryManager
              ingredients={ingredients}
              newIngredient={newIngredient}
              onNewIngredientChange={setNewIngredient}
              onAddIngredient={handleAddIngredient}
              onRemoveIngredient={handleRemoveIngredient}
              dietaryRestrictions={dietaryRestrictions}
              onToggleDietaryRestriction={handleToggleDietaryRestriction}
              onGenerate={handleGenerateRecipes}
              isLoading={isLoadingSuggestions}
            />
          </div>
          <div className="lg:col-span-2 xl:col-span-3">
            <RecipeTabs
              suggestedRecipes={suggestedRecipesList}
              favoriteRecipes={favoriteRecipes}
              onSelectRecipe={handleSelectRecipe}
              isLoading={isLoadingSuggestions}
            />
          </div>
        </div>
      </main>
      <RecipeDialog
        recipe={selectedRecipe}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isLoading={isLoadingDetails}
        isFavorite={selectedRecipe ? isFavorite(selectedRecipe.name) : false}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
