import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WeeklyProgress } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format, subDays, addDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressTracking() {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const { data: progress, isLoading } = useQuery<WeeklyProgress>({
    queryKey: ['/api/progress', dateRange.startDate, dateRange.endDate],
  });

  const handlePreviousWeek = () => {
    const newStartDate = subDays(new Date(dateRange.startDate), 7);
    const newEndDate = subDays(new Date(dateRange.endDate), 7);
    setDateRange({
      startDate: format(newStartDate, 'yyyy-MM-dd'),
      endDate: format(newEndDate, 'yyyy-MM-dd')
    });
  };

  const handleNextWeek = () => {
    const today = new Date();
    const newStartDate = addDays(new Date(dateRange.startDate), 7);
    const newEndDate = addDays(new Date(dateRange.endDate), 7);
    
    if (newEndDate <= today) {
      setDateRange({
        startDate: format(newStartDate, 'yyyy-MM-dd'),
        endDate: format(newEndDate, 'yyyy-MM-dd')
      });
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d');
  };

  if (isLoading) {
    return (
      <>
        <h3 className="text-lg font-medium text-white mb-3">Your Progress</h3>
        <div className="bg-card rounded-lg p-4 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-6 w-28" />
          </div>
          
          <Skeleton className="h-[200px] w-full mb-4" />
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </>
    );
  }

  const displayDateRange = progress 
    ? `${formatDate(progress.startDate)} - ${formatDate(progress.endDate)}`
    : '';

  return (
    <>
      <h3 className="text-lg font-medium text-white mb-3">Your Progress</h3>
      <div className="bg-card rounded-lg p-4 mb-6 shadow-lg card-hover">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-base font-medium text-white">Weekly Overview</h4>
          <div className="flex items-center text-xs text-gray-400">
            <i 
              className="ri-arrow-left-s-line cursor-pointer mr-2"
              onClick={handlePreviousWeek}
            ></i>
            <span>{displayDateRange}</span>
            <i 
              className="ri-arrow-right-s-line cursor-pointer ml-2"
              onClick={handleNextWeek}
            ></i>
          </div>
        </div>
        
        {/* Chart */}
        <div className="chart-container">
          {progress && progress.days && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={progress.days.map(day => ({
                  name: format(new Date(day.date), 'EEE'),
                  value: day.cravingIntensity
                }))}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#AAA" />
                <YAxis stroke="#AAA" domain={[0, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(45,45,45,0.8)', borderColor: '#444', color: '#EEE' }}
                  formatter={(value) => [`${value} cravings`, 'Intensity']}
                  labelFormatter={(label) => `${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#34D399"
                  strokeWidth={3}
                  dot={{ fill: '#34D399', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {/* Stats */}
        {progress && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Sugar-free Days</div>
              <div className="flex items-end">
                <span className="text-xl font-semibold text-white">{progress.sugarFreeDays}</span>
                <span className={`text-xs ml-2 ${progress.sugarFreeDaysDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {progress.sugarFreeDaysDiff > 0 && '+'}
                  {progress.sugarFreeDaysDiff} from last week
                </span>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Craving Score</div>
              <div className="flex items-end">
                <span className="text-xl font-semibold text-white">{progress.cravingScore.toFixed(1)}</span>
                <span className={`text-xs ml-2 ${progress.cravingScoreDiff <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {progress.cravingScoreDiff <= 0 ? '' : '+'}
                  {progress.cravingScoreDiff.toFixed(1)} from last week
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
