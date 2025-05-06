import { useQuery } from '@tanstack/react-query';
import { HealthTip } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';

export default function HealthTips() {
  const { data: healthTip, isLoading } = useQuery<HealthTip>({
    queryKey: ['/api/health-tips/featured'],
  });

  if (isLoading) {
    return (
      <>
        <h3 className="text-lg font-medium text-white mb-3">Healthy Inspiration</h3>
        <div className="bg-card rounded-lg overflow-hidden mb-10 shadow-lg">
          <Skeleton className="h-40 w-full" />
          <div className="p-3">
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </>
    );
  }

  if (!healthTip) {
    return null;
  }

  return (
    <>
      <h3 className="text-lg font-medium text-white mb-3">Healthy Inspiration</h3>
      <div className="bg-card rounded-lg overflow-hidden mb-10 shadow-lg card-hover">
        <div className="h-40 w-full relative">
          <img 
            src={healthTip.imageUrl} 
            alt={healthTip.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <h4 className="text-white font-medium">{healthTip.title}</h4>
            <p className="text-gray-300 text-xs">{healthTip.readTime}</p>
          </div>
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-300 mb-2">{healthTip.description}</p>
          <Link href={`/articles/${healthTip.articleId}`}>
            <div className="w-full py-2 bg-muted hover:bg-gray-600 text-white text-sm rounded-button cursor-pointer transition-colors text-center">
              Read More
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
