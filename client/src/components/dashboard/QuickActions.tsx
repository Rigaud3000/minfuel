import { Link } from 'wouter';

interface QuickActionProps {
  icon: string;
  color: string;
  bgColor: string;
  label: string;
  path: string;
}

const QuickAction = ({ icon, color, bgColor, label, path }: QuickActionProps) => (
  <Link href={path}>
    <div className="bg-card rounded-lg p-3 flex flex-col items-center cursor-pointer hover:bg-muted transition-colors card-hover">
      <div className={`w-10 h-10 flex items-center justify-center ${bgColor} rounded-full mb-2`}>
        <i className={`${icon} ${color} ri-lg`}></i>
      </div>
      <span className="text-xs text-center text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis">
        {label}
      </span>
    </div>
  </Link>
);

export default function QuickActions() {
  const actions = [
    {
      icon: 'ri-message-3-line',
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
      label: 'AI Coach',
      path: '/ai-coach'
    },
    {
      icon: 'ri-trophy-line',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20',
      label: 'Challenges',
      path: '/challenges'
    },
    {
      icon: 'ri-bar-chart-2-line',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20',
      label: 'Progress',
      path: '/progress'
    }
  ];

  return (
    <>
      <h3 className="text-lg font-medium text-white mb-3">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {actions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>
    </>
  );
}
