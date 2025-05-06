import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import { loginUser, registerUser } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion } from 'framer-motion';

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await loginUser(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in to your account.",
        });
      } else {
        await registerUser(email, password, name);
        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        });
      }
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast({
        title: "Authentication error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="w-full max-w-sm p-6 mx-auto bg-card rounded-lg shadow-lg"
      initial="initial"
      animate="animate"
      variants={formVariants}
    >
      <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-4 text-white">
        {isLogin ? t.auth.login : t.auth.createAccount}
      </motion.h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="name">{t.auth.name}</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              className="bg-muted text-white"
            />
          </motion.div>
        )}
        
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="email">{t.auth.email}</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-muted text-white"
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="password">{t.auth.password}</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-muted text-white"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            className="w-full bg-secondary hover:bg-secondary/90 text-gray-900 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <i className="ri-loader-2-line animate-spin mr-2"></i>
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </span>
            ) : (
              <span>{isLogin ? t.auth.login : t.auth.createAccount}</span>
            )}
          </Button>
        </motion.div>
      </form>
      
      <motion.div variants={itemVariants} className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          {isLogin ? t.auth.dontHaveAccount : t.auth.alreadyHaveAccount}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="ml-2 text-secondary hover:underline focus:outline-none"
          >
            {isLogin ? t.auth.createAccount : t.auth.login}
          </button>
        </p>
      </motion.div>
      
      {user && (
        <motion.div 
          variants={itemVariants}
          className="mt-4 p-3 rounded bg-green-500/10 border border-green-500/30"
        >
          <p className="text-green-400 text-sm flex items-center">
            <i className="ri-check-line mr-2"></i>
            Logged in as: {user.email}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AuthForm;