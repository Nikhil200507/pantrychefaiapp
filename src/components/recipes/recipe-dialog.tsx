'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Timer, Users, Soup } from 'lucide-react';
import type { Recipe } from '@/types';

type RecipeDialogProps = {
  recipe: Recipe | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
};

const DetailSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-1/3" />
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-1/3" />
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
      </div>
    </div>
  </div>
);

export default function RecipeDialog({
  recipe,
  isOpen,
  onOpenChange,
  isLoading,
  isFavorite,
  onToggleFavorite,
}: RecipeDialogProps) {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <ScrollArea className="max-h-[85vh] p-6">
          <div className="pr-4">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold font-headline">{recipe.name}</DialogTitle>
              {isLoading ? (
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <DialogDescription className="text-base pt-2">{recipe.description}</DialogDescription>
              )}
            </DialogHeader>

            <div className="my-6">
                {isLoading ? (
                    <DetailSkeleton />
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                             <div className="flex items-center gap-x-6 gap-y-2 flex-wrap text-sm text-muted-foreground">
                                {recipe.prepTime && <Badge variant="outline" className="flex items-center gap-2 py-1 px-3"><Timer size={14} /> Prep: {recipe.prepTime}</Badge>}
                                {recipe.cookTime && <Badge variant="outline" className="flex items-center gap-2 py-1 px-3"><Soup size={14} /> Cook: {recipe.cookTime}</Badge>}
                                {recipe.servings && <Badge variant="outline" className="flex items-center gap-2 py-1 px-3"><Users size={14} /> Serves: {recipe.servings}</Badge>}
                            </div>
                             <Button
                                variant={isFavorite ? 'destructive' : 'outline'}
                                size="sm"
                                onClick={() => onToggleFavorite(recipe)}
                                className="transition-colors"
                                >
                                <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </Button>
                        </div>
                       
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <h3 className="text-lg font-semibold font-headline mb-3 border-b pb-2">Ingredients</h3>
                                <ul className="space-y-2 text-sm list-disc pl-5">
                                    {recipe.ingredients.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold font-headline mb-3 border-b pb-2">Instructions</h3>
                                <ol className="space-y-4 text-sm list-decimal pl-5">
                                    {recipe.instructions.map((step, index) => (
                                        <li key={index} className="pl-2">{step}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
