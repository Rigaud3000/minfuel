import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Challenges from "@/pages/Challenges";
import SugarDetox from "@/pages/challenges/SugarDetox";
import HealthyBreakfast from "@/pages/challenges/HealthyBreakfast";
import MindfulEating from "@/pages/challenges/MindfulEating";
import AiCoach from "@/pages/AiCoach";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import FoodScanner from "@/pages/FoodScanner";
import Subscription from "@/pages/Subscription";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

function Router() {
  const [location] = useLocation();
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white font-sans">
      <Navbar />
      <main className="flex-1 overflow-y-auto pt-16 pb-20">
        <div className="max-w-md mx-auto px-4">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/challenges" component={Challenges} />
            <Route path="/challenges/1" component={SugarDetox} />
            <Route path="/challenges/2" component={HealthyBreakfast} />
            <Route path="/challenges/3" component={MindfulEating} />
            <Route path="/food-scanner" component={FoodScanner} />
            <Route path="/ai-coach" component={AiCoach} />
            <Route path="/progress" component={Progress} />
            <Route path="/profile" component={Profile} />
            <Route path="/settings" component={Settings} />
            <Route path="/subscription" component={Subscription} />
            <Route path="/auth" component={Auth} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
      <BottomNavigation currentPath={location} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
