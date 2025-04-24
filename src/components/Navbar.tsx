
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';
import { cn } from '@/lib/utils';
import { History, Info, MessageSquare, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const openLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };
  
  const openSignup = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };
  
  const closeModal = () => {
    setShowAuthModal(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLinks = () => (
    <>
      <Link 
        to="/" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-potato-700",
          isActive('/') ? "text-potato-700" : "text-muted-foreground"
        )}
      >
        Home
      </Link>
      <Link 
        to="/upload" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-potato-700",
          isActive('/upload') ? "text-potato-700" : "text-muted-foreground"
        )}
      >
        Detection
      </Link>
      {isLoggedIn && (
        <Link 
          to="/history" 
          className={cn(
            "text-sm font-medium transition-colors hover:text-potato-700 flex items-center gap-1",
            isActive('/history') ? "text-potato-700" : "text-muted-foreground"
          )}
        >
          <History size={16} />
          History
        </Link>
      )}
      <Link 
        to="/about" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-potato-700 flex items-center gap-1",
          isActive('/about') ? "text-potato-700" : "text-muted-foreground"
        )}
      >
        <Info size={16} />
        About
      </Link>
      <Link 
        to="/feedback" 
        className={cn(
          "text-sm font-medium transition-colors hover:text-potato-700 flex items-center gap-1",
          isActive('/feedback') ? "text-potato-700" : "text-muted-foreground"
        )}
      >
        <MessageSquare size={16} />
        Feedback
      </Link>
    </>
  );
  
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm transition-all">
        <div className="container flex h-16 items-center">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
              <div className="relative flex items-center">
                <span className="text-2xl">🥔</span>
                <div className="ml-2 flex flex-col">
                  <span className="font-semibold text-lg text-potato-800">Potato</span>
                  <span className="text-[10px] -mt-1 text-muted-foreground">Disease Detection</span>
                </div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 mx-auto">
              <NavLinks />
            </nav>
            
            {/* Auth buttons or user info - always at the end */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <div className="hidden md:block">
                    <p className="text-sm text-muted-foreground">
                      Welcome, <span className="font-medium text-foreground">{user?.username}</span>
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-full border-potato-200 text-potato-700 hover:bg-potato-50"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {/* Log in button removed */}
                  <Button 
                    className="rounded-full bg-potato-600 text-white hover:bg-potato-700"
                    onClick={openSignup}
                  >
                    Sign up
                  </Button>
                </div>
              )}
              
              {/* Mobile Navigation - Positioned at the far right */}
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden ml-2">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                    <nav className="flex flex-col gap-4 mt-8">
                      <NavLinks />
                    </nav>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={closeModal} 
          initialMode={authMode}
        />
      )}
    </>
  );
};

export default Navbar;
