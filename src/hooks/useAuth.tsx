
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { API_URL } from '@/config/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on component mount
    const savedUser = localStorage.getItem('potato_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      
      const userData: User = { 
        username: data.username,
        email: data.email
      };
      
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('potato_user', JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });
      
      return Promise.resolve();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      return Promise.reject(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully. You can now log in.",
      });
      
      return Promise.resolve();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during signup';
      setError(errorMessage);
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      return Promise.reject(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('potato_user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    error,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
