
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Recipe } from '@/types';
import { BookOpen, Heart } from 'lucide-react';

type RecipeTabsProps = {
  suggestedRecipes: string[];
  favoriteRecipes: Recipe[];
  onSelectRecipe: (recipeName: string) => void;
  isLoading: boolean;
};

const RecipeCard = ({ name, onSelect }: { name: string; onSelect: (name: string) => void }) => (
  <Card 
    className="cursor-pointer hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col"
    onClick={() => onSelect(name)}
  >
    <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div>
            <CardTitle className="text-lg font-bold font-headline">{name}</CardTitle>
        </div>
        <CardDescription className="mt-4 flex items-center text-sm text-primary">
            <BookOpen className="mr-2 h-4 w-4"/>
            View Recipe
        </CardDescription>
    </CardContent>
  </Card>
);

const FavoriteRecipeCard = ({ recipe, onSelect }: { recipe: Recipe; onSelect: (name: string) => void }) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300 group h-full flex flex-col"
      onClick={() => onSelect(recipe.name)}
    >
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div>
            <CardTitle className="text-lg font-bold font-headline">{recipe.name}</CardTitle>
            <CardDescription className="mt-2 text-sm text-muted-foreground line-clamp-3">{recipe.description}</CardDescription>
        </div>
        <div className="mt-4 flex items-center text-sm text-primary">
            <BookOpen className="mr-2 h-4 w-4"/>
            View Recipe
        </div>
      </CardContent>
    </Card>
  );

const RecipeSkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full" />
       <Skeleton className="h-4 w-full mt-2" />
       <Skeleton className="h-4 w-1/2 mt-2" />
    </CardContent>
  </Card>
);

export default function RecipeTabs({
  suggestedRecipes,
  favoriteRecipes,
  onSelectRecipe,
  isLoading,
}: RecipeTabsProps) {
  return (
    <Tabs defaultValue="suggestions">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
      </TabsList>
      <TabsContent value="suggestions" className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <RecipeSkeleton key={i} />)}
          </div>
        ) : suggestedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {suggestedRecipes.map((name) => (
              <RecipeCard key={name} name={name} onSelect={onSelectRecipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-semibold">No Suggestions Yet</h3>
            <p className="text-muted-foreground mt-2">Add ingredients to your pantry and click "Generate Recipes" to get started!</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="favorites" className="mt-6">
        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe) => (
              <FavoriteRecipeCard key={recipe.name} recipe={recipe} onSelect={onSelectRecipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Favorites Saved</h3>
            <p className="text-muted-foreground mt-2">Your favorite recipes will appear here.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
