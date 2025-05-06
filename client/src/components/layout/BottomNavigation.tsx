import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface BottomNavigationProps {
  currentPath: string;
}

export default function BottomNavigation({ currentPath }: BottomNavigationProps) {
  const { t } = useLanguage();
  
  const navigationItems = [
    { path: "/", icon: "ri-home-5-fill", label: t.navigation.home },
    { path: "/challenges", icon: "ri-trophy-line", label: t.navigation.challenges },
    { path: "/food-scanner", icon: "ri-camera-3-line", label: t.navigation.foodScanner },
    { path: "/ai-coach", icon: "ri-message-3-line", label: t.navigation.aiCoach },
    { path: "/progress", icon: "ri-bar-chart-2-line", label: t.navigation.progress },
    { path: "/subscription", icon: "ri-vip-crown-line", label: t.navigation.subscription }
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md mx-auto z-50 bg-background border-t border-muted shadow-lg">
      <div className="flex justify-between items-center px-2 py-2">
        {navigationItems.map((item) => (
          <Link href={item.path} key={item.path}>
            <div 
              className={`flex flex-col items-center px-2 py-1 cursor-pointer ${
                currentPath === item.path 
                  ? "text-secondary" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <i className={`${item.icon} ri-lg`}></i>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
