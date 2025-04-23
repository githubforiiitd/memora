
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Home, Calendar, Star, Settings, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const navItems: NavItem[] = [
    { name: 'Home', path: '/', icon: <Home size={20} className="transition-transform duration-200 group-hover:scale-110" /> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar size={20} className="transition-transform duration-200 group-hover:scale-110" /> },
    { name: 'Favorites', path: '/favorites', icon: <Star size={20} className="transition-transform duration-200 group-hover:scale-110" /> },
    { name: 'Highlights', path: '/memories', icon: <Camera size={20} className="transition-transform duration-200 group-hover:scale-110" /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} className="transition-transform duration-200 group-hover:scale-110" /> },
  ];

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    toast({
      description: `${newMode ? 'Dark' : 'Light'} mode activated`,
      duration: 1500,
    });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn("min-h-screen flex flex-col w-full transition-colors duration-300")}>
      {/* Header */}
      <header className="border-b py-3 px-4 flex items-center justify-between bg-background sticky top-0 z-20 w-full backdrop-blur-sm bg-background/80">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-memora-purple flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-105">
            <Camera size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold transition-all duration-300">Memora</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-secondary transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 w-full">
        {/* Sidebar Navigation - hidden on mobile */}
        {!isMobile && (
          <aside className="w-16 md:w-60 p-2 md:p-4 border-r bg-background shrink-0 transition-all duration-300">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "nav-link w-full text-left py-2 px-3 rounded-md transition-all duration-200 group",
                    location.pathname === item.path ? 
                      "bg-secondary/50 text-primary font-medium" : 
                      "hover:bg-secondary/30 text-foreground/70 hover:text-foreground",
                    "flex md:flex-row flex-col items-center justify-center md:justify-start"
                  )}
                  title={item.name}
                >
                  {item.icon}
                  <span className="text-xs md:text-base md:ml-3 mt-1 md:mt-0">{!isMobile && item.name}</span>
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 p-2 sm:p-4 md:p-6 overflow-auto w-full",
          isMobile ? "pb-20" : "pb-6"
        )}>
          {children}
        </main>
      </div>

      {/* Mobile Navigation - Fixed to bottom */}
      {isMobile && (
        <nav className="border-t p-2 flex justify-around bg-background/90 backdrop-blur-sm fixed bottom-0 left-0 right-0 z-20 shadow-md">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "p-2 rounded-md flex flex-col items-center transition-all duration-200",
                location.pathname === item.path ? "text-primary scale-110" : "text-foreground/70 hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="text-[10px] mt-1">{item.name}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Layout;
