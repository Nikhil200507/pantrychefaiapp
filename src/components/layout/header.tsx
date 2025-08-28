import { ChefHat } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <ChefHat className="h-7 w-7 text-primary" />
          <h1 className="ml-3 text-xl font-bold tracking-tight text-foreground font-headline">
            Pantry Chef
          </h1>
        </div>
      </div>
    </header>
  );
}
