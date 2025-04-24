
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const { login, signup, loading, error } = useAuth();
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  
  // Form validation
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    if (!loginEmail || !loginPassword) {
      setValidationError('Please enter both email and password');
      return;
    }
    
    try {
      await login(loginEmail, loginPassword);
      onClose();
    } catch (err) {
      // Error is handled in the useAuth hook
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    if (!signupUsername || !signupEmail || !signupPassword) {
      setValidationError('Please fill all required fields');
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    try {
      await signup(signupUsername, signupEmail, signupPassword);
      // Switch to login mode after successful signup
      setMode('login');
      setLoginEmail(signupEmail);
      // Reset signup form
      setSignupUsername('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
    } catch (err) {
      // Error is handled in the useAuth hook
    }
  };
  
  const switchToSignup = () => {
    setMode('signup');
    setValidationError(null);
  };
  
  const switchToLogin = () => {
    setMode('login');
    setValidationError(null);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0">
        <div className="p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {mode === 'login' 
                ? 'Enter your credentials to access your account' 
                : 'Sign up to detect potato diseases and access more features'}
            </DialogDescription>
          </DialogHeader>
          
          {(error || validationError) && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {validationError || error}
            </div>
          )}
          
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="potato-input"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button type="button" variant="link" className="px-0 text-xs text-potato-600 hover:text-potato-700">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="potato-input"
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full potato-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Log in'
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-potato-600 underline hover:text-potato-700 transition-colors"
                  onClick={switchToSignup}
                >
                  Sign up
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="johndoe"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  className="potato-input"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="potato-input"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="potato-input"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className="potato-input"
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full potato-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-potato-600 underline hover:text-potato-700 transition-colors"
                  onClick={switchToLogin}
                >
                  Log in
                </button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
