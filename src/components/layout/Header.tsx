import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-card/80 backdrop-blur-xl border-b border-border z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            AIvolve
          </button>
          <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
            Enterprise
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-foreground max-w-[150px] truncate">
                {user?.email}
              </span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-popover border border-border shadow-modal overflow-hidden"
                >
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{user?.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout Button - Icon Only */}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
