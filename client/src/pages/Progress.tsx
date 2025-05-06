import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WeeklyProgress, DayProgress } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subMonths, eachDayOfInterval, startOfMonth, endOfMonth, isToday } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export default function Progress() {
  const [activeTab, setActiveTab] = useState('week');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  const { data: weeklyProgress, isLoading: isLoadingWeekly } = useQuery<WeeklyProgress>({
    queryKey: ['/api/progress/week'],
  });

  const { data: monthlyProgress, isLoading: isLoadingMonthly } = useQuery<DayProgress[]>({
    queryKey: ['/api/progress/month', format(selectedMonth, 'yyyy-MM')],
    enabled: activeTab === 'month',
  });

  const handlePreviousMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    if (nextMonth <= new Date()) {
      setSelectedMonth(nextMonth);
    }
  };

  const renderCalendar = () => {
    if (!monthlyProgress) return null;
    
    const startDate = startOfMonth(selectedMonth);
    const endDate = endOfMonth(selectedMonth);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    const getCravingColor = (date: Date) => {
      const dayProgress = monthlyProgress.find(d => d.date === format(date, 'yyyy-MM-dd'));
      if (!dayProgress) return 'bg-muted';
      
      const intensity = dayProgress.cravingIntensity;
      if (intensity <= 3) return 'bg-green-500/30';
      if (intensity <= 6) return 'bg-yellow-500/30';
      return 'bg-red-500/30';
    };

    const getCompletionPercentage = (date: Date) => {
      const dayProgress = monthlyProgress.find(d => d.date === format(date, 'yyyy-MM-dd'));
      if (!dayProgress || dayProgress.totalTasks === 0) return 0;
      return Math.round((dayProgress.tasksCompleted / dayProgress.totalTasks) * 100);
    };

    return (
      <div className="grid grid-cols-7 gap-1 mt-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={`header-${i}`} className="text-center text-xs text-gray-400">
            {day}
          </div>
        ))}
        
        {days.map((day, i) => (
          <div 
            key={`day-${i}`} 
            className={`
              aspect-square rounded-md flex flex-col items-center justify-center text-xs 
              ${getCravingColor(day)}
              ${isToday(day) ? 'border border-secondary' : ''}
            `}
          >
            <span className={`font-medium ${getCompletionPercentage(day) > 0 ? 'text-white' : 'text-gray-400'}`}>
              {format(day, 'd')}
            </span>
            {getCompletionPercentage(day) > 0 && (
              <span className="text-[10px] text-gray-300">{getCompletionPercentage(day)}%</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pt-4 pb-4">
      <h2 className="text-2xl font-semibold text-white mb-6">Your Progress</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-2 w-full bg-muted">
          <TabsTrigger value="week">Weekly</TabsTrigger>
          <TabsTrigger value="month">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="week">
          <div className="bg-card rounded-lg p-4 shadow-lg">
            {isLoadingWeekly ? (
              <>
                <Skeleton className="h-6 w-36 mb-4" />
                <Skeleton className="h-[200px] w-full mb-6" />
                <Skeleton className="h-[120px] w-full" />
              </>
            ) : weeklyProgress ? (
              <>
                <h3 className="text-lg font-medium text-white mb-4">Cravings Intensity</h3>
                <div className="h-[200px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weeklyProgress.days.map(day => ({
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
                        formatter={(value) => [`${value} intensity`, 'Cravings']}
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
                </div>
                
                <h3 className="text-lg font-medium text-white mb-4">Task Completion</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weeklyProgress.days.map(day => ({
                        name: format(new Date(day.date), 'EEE'),
                        completed: day.tasksCompleted,
                        total: day.totalTasks
                      }))}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#AAA" />
                      <YAxis stroke="#AAA" />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(45,45,45,0.8)', borderColor: '#444', color: '#EEE' }}
                      />
                      <Legend />
                      <Bar dataKey="completed" name="Completed" fill="#34D399" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="total" name="Total Tasks" fill="#555" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Sugar-free Days</div>
                    <div className="flex items-end">
                      <span className="text-xl font-semibold text-white">{weeklyProgress.sugarFreeDays}</span>
                      <span className={`text-xs ml-2 ${weeklyProgress.sugarFreeDaysDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {weeklyProgress.sugarFreeDaysDiff > 0 && '+'}
                        {weeklyProgress.sugarFreeDaysDiff} from last week
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Avg. Craving Score</div>
                    <div className="flex items-end">
                      <span className="text-xl font-semibold text-white">{weeklyProgress.cravingScore.toFixed(1)}</span>
                      <span className={`text-xs ml-2 ${weeklyProgress.cravingScoreDiff <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {weeklyProgress.cravingScoreDiff <= 0 ? '' : '+'}
                        {weeklyProgress.cravingScoreDiff.toFixed(1)} from last week
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No weekly progress data available yet</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="month">
          <div className="bg-card rounded-lg p-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <button onClick={handlePreviousMonth} className="text-gray-400 hover:text-white">
                <i className="ri-arrow-left-s-line text-lg"></i>
              </button>
              <h3 className="text-lg font-medium text-white">
                {format(selectedMonth, 'MMMM yyyy')}
              </h3>
              <button onClick={handleNextMonth} className="text-gray-400 hover:text-white">
                <i className="ri-arrow-right-s-line text-lg"></i>
              </button>
            </div>
            
            {isLoadingMonthly ? (
              <Skeleton className="h-[320px] w-full" />
            ) : monthlyProgress ? (
              <>
                {renderCalendar()}
                
                <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500/30 rounded-full mr-1"></div>
                    <span>Low (0-3)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500/30 rounded-full mr-1"></div>
                    <span>Medium (4-6)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500/30 rounded-full mr-1"></div>
                    <span>High (7-10)</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-white mt-6 mb-3">Monthly Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Completed Tasks</div>
                    <div className="text-xl font-semibold text-white">
                      {monthlyProgress.reduce((sum, day) => sum + day.tasksCompleted, 0)}
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Sugar-Free Days</div>
                    <div className="text-xl font-semibold text-white">
                      {monthlyProgress.filter(day => day.cravingIntensity <= 3).length}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No monthly progress data available yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
