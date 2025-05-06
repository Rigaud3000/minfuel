import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import { logoutUser } from '@/lib/firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import logoImage from "@/assets/logo.png";

export default function Navbar() {
  const { data: serverUser } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });
  
  const [firebaseUser, loading] = useAuthState(auth);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: t.auth.logout,
        description: "You have been successfully logged out.",
      });
      setLocation('/');
    } catch (error: any) {
      toast({
        title: t.general.error,
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleLogin = () => {
    setLocation('/auth');
  };

  return (
    <div className="fixed top-0 w-full z-50 bg-background border-b border-muted shadow-md">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img src={logoImage} alt="MindFuel Logo" className="h-10 w-auto" />
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            
            {firebaseUser ? (
              <>
                <div 
                  className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-muted rounded-full transition-colors"
                  onClick={() => {
                    // Handle notifications
                  }}
                >
                  <i className="ri-notification-3-line text-gray-300 ri-lg"></i>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="w-8 h-8 flex items-center justify-center cursor-pointer">
                      {serverUser?.profilePicture ? (
                        <img 
                          src={serverUser.profilePicture} 
                          className="w-8 h-8 rounded-full object-cover border border-secondary" 
                          alt="Profile" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                          {firebaseUser?.displayName?.charAt(0) || firebaseUser?.email?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-muted text-white">
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-muted focus:bg-muted"
                      onClick={() => setLocation('/profile')}
                    >
                      <i className="ri-user-line mr-2"></i> {t.profile.title}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-muted focus:bg-muted"
                      onClick={() => setLocation('/settings')}
                    >
                      <i className="ri-settings-3-line mr-2"></i> {t.navigation.settings}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer hover:bg-muted focus:bg-muted"
                      onClick={handleLogout}
                    >
                      <i className="ri-logout-box-line mr-2"></i> {t.auth.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="px-3 py-1 text-sm bg-secondary text-gray-900 rounded-full font-medium hover:bg-secondary/90"
              >
                {t.auth.login}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
