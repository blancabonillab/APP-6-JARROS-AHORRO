import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { JAR_INFO } from '../context/FinanceContext';
import { DirectIncomeForm } from './DirectIncomeForm';
import { WithdrawForm } from './WithdrawForm';
import { 
  Home, 
  TrendingUp, 
  PiggyBank, 
  GraduationCap, 
  PartyPopper, 
  Heart 
} from 'lucide-react';

const iconMap = {
  Home,
  TrendingUp,
  PiggyBank,
  GraduationCap,
  PartyPopper,
  Heart,
};

const jarColors = {
  NEC: {
    bg: 'bg-primary/10 dark:bg-primary/20',
    text: 'text-primary',
    border: 'border-primary/20',
    fill: 'bg-primary',
  },
  LF: {
    bg: 'bg-success/10 dark:bg-success/20',
    text: 'text-success',
    border: 'border-success/20',
    fill: 'bg-success',
  },
  ALP: {
    bg: 'bg-chart-3/10 dark:bg-chart-3/20',
    text: 'text-chart-3',
    border: 'border-chart-3/20',
    fill: 'bg-chart-3',
  },
  EDU: {
    bg: 'bg-warning/10 dark:bg-warning/20',
    text: 'text-warning',
    border: 'border-warning/20',
    fill: 'bg-warning',
  },
  PLAY: {
    bg: 'bg-chart-5/10 dark:bg-chart-5/20',
    text: 'text-chart-5',
    border: 'border-chart-5/20',
    fill: 'bg-chart-5',
  },
  DAR: {
    bg: 'bg-chart-6/10 dark:bg-chart-6/20',
    text: 'text-chart-6',
    border: 'border-chart-6/20',
    fill: 'bg-chart-6',
  },
};

export const JarCard = ({ jarKey, balance, totalBalance, index = 0 }) => {
  const info = JAR_INFO[jarKey];
  const colors = jarColors[jarKey];
  const Icon = iconMap[info.icon];
  
  // Calculate fill percentage (for visual jar fill effect)
  const maxForJar = totalBalance * (info.percentage / 100) * 2;
  const fillPercentage = maxForJar > 0 ? Math.min((balance / maxForJar) * 100, 100) : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className={`relative overflow-hidden border ${colors.border} hover:shadow-md transition-shadow duration-300`}>
        {/* Fill indicator background */}
        <motion.div 
          className={`absolute bottom-0 left-0 right-0 ${colors.fill} opacity-10`}
          initial={{ height: 0 }}
          animate={{ height: `${fillPercentage}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
        />
        
        <CardContent className="p-4 relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${colors.bg}`}>
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
              {info.percentage}%
            </span>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-heading font-semibold text-sm text-foreground">
              {info.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {info.description}
            </p>
          </div>
          
          <div className="mt-3 pt-3 border-t border-border/50">
            <motion.p 
              className={`font-heading text-xl font-bold ${colors.text}`}
              key={balance}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.p>
            <p className="text-xs text-muted-foreground">USD</p>
          </div>
          
          {/* Action buttons */}
          <div className="mt-3 pt-3 border-t border-border/50 flex justify-center gap-2">
            <DirectIncomeForm jarKey={jarKey} />
            <WithdrawForm jarKey={jarKey} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JarCard;
