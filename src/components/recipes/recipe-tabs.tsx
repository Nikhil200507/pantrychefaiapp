import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
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
    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
    onClick={() => onSelect(name)}
  >
    <CardHeader className="p-0">
      <div className="relative h-40 w-full">
        <Image
          src={`https://picsum.photos/seed/${name.replace(/\s/g, '')}/400/200`}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="food recipe"
        />
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <CardTitle className="text-lg font-bold font-headline truncate">{name}</CardTitle>
      <CardDescription className="mt-2 flex items-center text-sm text-primary">
        <BookOpen className="mr-2 h-4 w-4"/>
        View Recipe
      </CardDescription>
    </CardContent>
  </Card>
);

const FavoriteRecipeCard = ({ recipe, onSelect }: { recipe: Recipe; onSelect: (name: string) => void }) => (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
      onClick={() => onSelect(recipe.name)}
    >
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <Image
            src={`https://picsum.photos/seed/${recipe.name.replace(/\s/g, '')}/400/200`}
            alt={recipe.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="food recipe"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold font-headline truncate">{recipe.name}</CardTitle>
        <CardDescription className="mt-1 text-xs text-muted-foreground line-clamp-2">{recipe.description}</CardDescription>
      </CardContent>
    </Card>
  );

const RecipeSkeleton = () => (
  <Card>
    <CardHeader className="p-0">
      <Skeleton className="h-40 w-full" />
    </CardHeader>
    <CardContent className="p-4">
      <Skeleton className="h-6 w-3/4" />
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
