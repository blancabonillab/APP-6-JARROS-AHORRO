import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useFinance } from '../context/FinanceContext';
import { Sun, Moon, Wallet, Shield } from 'lucide-react';

export const Header = () => {
  const { theme, toggleTheme, totalBalance } = useFinance();
  
  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-glow">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-foreground leading-none">
              6 Jarros
            </h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>100% Offline</span>
            </div>
          </div>
        </div>
        
        {/* Center - Total Balance (Desktop) */}
        <div className="hidden md:flex flex-col items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Balance Total
          </span>
          <motion.span 
            className="font-heading text-2xl font-bold text-foreground"
            key={totalBalance}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
          >
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-sm text-muted-foreground ml-1">USD</span>
          </motion.span>
        </div>
        
        {/* Right - Theme Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden"
          >
            <motion.div
              initial={false}
              animate={{ 
                rotate: theme === 'dark' ? 0 : 180,
                scale: theme === 'dark' ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              <Moon className="w-5 h-5" />
            </motion.div>
            <motion.div
              initial={false}
              animate={{ 
                rotate: theme === 'light' ? 0 : -180,
                scale: theme === 'light' ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          </Button>
        </div>
      </div>
      
      {/* Mobile - Total Balance */}
      <div className="md:hidden border-t border-border/50 px-4 py-2 flex items-center justify-between bg-muted/30">
        <span className="text-xs text-muted-foreground">Balance Total</span>
        <motion.span 
          className="font-heading font-bold text-foreground"
          key={totalBalance}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
        >
          ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </motion.span>
      </div>
    </motion.header>
  );
};

export default Header;
