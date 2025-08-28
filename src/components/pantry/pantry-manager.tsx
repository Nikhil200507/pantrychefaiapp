
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Sparkles, Salad, WheatOff, Vegan } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type PantryManagerProps = {
  ingredients: string[];
  newIngredient: string;
  onNewIngredientChange: (value: string) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (ingredient: string) => void;
  dietaryRestrictions: string[];
  onToggleDietaryRestriction: (restriction: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
};

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian', icon: Salad },
  { id: 'gluten-free', label: 'Gluten-Free', icon: WheatOff },
  { id: 'vegan', label: 'Vegan', icon: Vegan },
];

export default function PantryManager({
  ingredients,
  newIngredient,
  onNewIngredientChange,
  onAddIngredient,
  onRemoveIngredient,
  dietaryRestrictions,
  onToggleDietaryRestriction,
  onGenerate,
  isLoading,
}: PantryManagerProps) {
  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="font-headline">My Pantry</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="ingredient-input" className="text-sm font-medium">Add Ingredient</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                id="ingredient-input"
                type="text"
                value={newIngredient}
                onChange={(e) => onNewIngredientChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onAddIngredient()}
                placeholder="e.g., Chicken"
              />
              <Button size="icon" onClick={onAddIngredient} aria-label="Add Ingredient">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Your Ingredients</h3>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {ingredients.length > 0 ? (
                ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary" className="text-base py-1 pl-3 pr-2">
                    {ingredient}
                    <button
                      onClick={() => onRemoveIngredient(ingredient)}
                      className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      aria-label={`Remove ${ingredient}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Your pantry is empty.</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Dietary Filters</h3>
            <div className="space-y-3">
              {dietaryOptions.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={dietaryRestrictions.includes(option.label)}
                    onCheckedChange={() => onToggleDietaryRestriction(option.label)}
                  />
                  <Label htmlFor={option.id} className="flex items-center gap-2 font-normal cursor-pointer">
                    <option.icon className="h-4 w-4 text-muted-foreground" />
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Button onClick={onGenerate} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Recipes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
