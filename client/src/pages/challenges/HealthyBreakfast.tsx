
import { useQuery } from '@tanstack/react-query';
import { Challenge, Recipe } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/ui/PageTransition';

export default function HealthyBreakfast() {
  const { t } = useLanguage();
  
  const { data: challenge } = useQuery<Challenge>({
    queryKey: ['/api/challenges/healthy-breakfast'],
  });

  const { data: recipes } = useQuery<Recipe[]>({
    queryKey: ['/api/challenges/healthy-breakfast/recipes'],
  });

  const currentDay = challenge?.currentDay || 1;
  const progress = (currentDay / 7) * 100;

  return (
    <PageTransition className="pt-4 pb-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">Healthy Breakfast Challenge</h1>
        <p className="text-gray-400">Start your day right with 7 days of nutritious breakfast recipes</p>
      </div>

      <div className="bg-card rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-secondary">{`Day ${currentDay} of 7`}</span>
        </div>
        <Progress value={progress} className="mb-4" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Day 1</span>
          <span>Day 7</span>
        </div>
      </div>

      <div className="space-y-4">
        {recipes?.map((recipe, index) => (
          <div key={recipe.id} className="bg-card rounded-lg overflow-hidden">
            {recipe.image && (
              <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-white">{recipe.title}</h3>
                <span className="text-sm text-gray-400">{`Day ${index + 1}`}</span>
              </div>
              <p className="text-gray-300 mb-3">{recipe.description}</p>
              <div className="flex justify-between text-sm text-gray-400 mb-4">
                <span>Prep: {recipe.prepTime}min</span>
                <span>Calories: {recipe.calories}</span>
              </div>
              <Button className="w-full bg-secondary hover:bg-green-500 text-gray-900">
                View Recipe
              </Button>
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
