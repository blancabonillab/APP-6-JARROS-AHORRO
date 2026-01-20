import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';

// SVG Plant Illustrations - Minimalist Flat Design
const SeedSVG = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pot */}
    <path d="M60 160 L70 130 L130 130 L140 160 Z" fill="hsl(var(--primary-dark))" />
    <path d="M65 130 L75 110 L125 110 L135 130 Z" fill="hsl(var(--primary))" />
    <ellipse cx="100" cy="110" rx="30" ry="8" fill="hsl(var(--muted))" />
    
    {/* Soil */}
    <ellipse cx="100" cy="110" rx="25" ry="6" fill="hsl(30 30% 35%)" />
    
    {/* Seed */}
    <motion.ellipse 
      cx="100" 
      cy="105" 
      rx="8" 
      ry="5" 
      fill="hsl(var(--primary-light))"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    
    {/* Sparkles */}
    <motion.circle 
      cx="85" cy="95" r="2" 
      fill="hsl(var(--primary-light))"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.circle 
      cx="115" cy="98" r="1.5" 
      fill="hsl(var(--primary-light))"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
    />
  </svg>
);

const SproutSVG = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pot */}
    <path d="M60 170 L70 140 L130 140 L140 170 Z" fill="hsl(var(--primary-dark))" />
    <path d="M65 140 L75 120 L125 120 L135 140 Z" fill="hsl(var(--primary))" />
    <ellipse cx="100" cy="120" rx="30" ry="8" fill="hsl(var(--muted))" />
    
    {/* Soil */}
    <ellipse cx="100" cy="120" rx="25" ry="6" fill="hsl(30 30% 35%)" />
    
    {/* Stem */}
    <motion.path 
      d="M100 118 Q100 90 100 70"
      stroke="hsl(var(--success))"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5 }}
    />
    
    {/* Left Leaf */}
    <motion.path 
      d="M100 85 Q80 75 75 60 Q85 70 100 75 Z"
      fill="hsl(var(--success))"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    />
    
    {/* Right Leaf */}
    <motion.path 
      d="M100 75 Q120 65 125 50 Q115 60 100 65 Z"
      fill="hsl(142 65% 50%)"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.2 }}
    />
    
    {/* Animated glow */}
    <motion.circle 
      cx="100" cy="55" r="15" 
      fill="hsl(var(--success) / 0.2)"
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);

const TreeSVG = ({ className }) => (
  <svg viewBox="0 0 200 220" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pot */}
    <path d="M60 200 L70 170 L130 170 L140 200 Z" fill="hsl(var(--primary-dark))" />
    <path d="M65 170 L75 150 L125 150 L135 170 Z" fill="hsl(var(--primary))" />
    <ellipse cx="100" cy="150" rx="30" ry="8" fill="hsl(var(--muted))" />
    
    {/* Soil */}
    <ellipse cx="100" cy="150" rx="25" ry="6" fill="hsl(30 30% 35%)" />
    
    {/* Trunk */}
    <motion.path 
      d="M95 148 L95 100 L105 100 L105 148 Z"
      fill="hsl(25 40% 40%)"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.8 }}
      style={{ transformOrigin: 'bottom' }}
    />
    
    {/* Main foliage - layered circles */}
    <motion.ellipse 
      cx="100" cy="70" rx="45" ry="40" 
      fill="hsl(var(--success))"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    />
    <motion.ellipse 
      cx="75" cy="85" rx="25" ry="22" 
      fill="hsl(142 60% 45%)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    />
    <motion.ellipse 
      cx="125" cy="85" rx="25" ry="22" 
      fill="hsl(142 60% 45%)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    />
    <motion.ellipse 
      cx="100" cy="50" rx="30" ry="25" 
      fill="hsl(142 55% 50%)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.9 }}
    />
    
    {/* Golden coins/fruits */}
    <motion.circle 
      cx="80" cy="60" r="6" 
      fill="hsl(var(--warning))"
      initial={{ scale: 0 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
    />
    <motion.circle 
      cx="120" cy="55" r="5" 
      fill="hsl(38 85% 55%)"
      initial={{ scale: 0 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 1.5 }}
    />
    <motion.circle 
      cx="95" cy="40" r="4" 
      fill="hsl(var(--warning))"
      initial={{ scale: 0 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 1.8 }}
    />
    <motion.circle 
      cx="110" cy="75" r="5" 
      fill="hsl(38 85% 55%)"
      initial={{ scale: 0 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 2 }}
    />
    
    {/* Sparkle effects */}
    <motion.path 
      d="M60 30 L65 40 L60 50 L55 40 Z"
      fill="hsl(var(--warning))"
      animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.path 
      d="M140 45 L145 55 L140 65 L135 55 Z"
      fill="hsl(var(--primary-light))"
      animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
    />
  </svg>
);

const stageInfo = {
  seed: {
    title: 'Semilla',
    subtitle: '$0 - $100 USD',
    description: '¡Tu camino hacia la libertad financiera comienza aquí!',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  sprout: {
    title: 'Brote',
    subtitle: '$101 - $1,000 USD',
    description: '¡Excelente! Tu planta está creciendo. ¡Sigue así!',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  tree: {
    title: 'Árbol de la Riqueza',
    subtitle: '> $1,000 USD',
    description: '¡Increíble! Has cultivado un árbol próspero.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
};

export const PlantVisualization = () => {
  const { plantStage, saldos } = useFinance();
  const info = stageInfo[plantStage];
  
  const PlantComponent = {
    seed: SeedSVG,
    sprout: SproutSVG,
    tree: TreeSVG,
  }[plantStage];
  
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={plantStage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Background glow */}
          <div className={`absolute inset-0 ${info.bgColor} rounded-full blur-3xl opacity-50`} />
          
          {/* Plant SVG */}
          <PlantComponent className="w-48 h-48 md:w-56 md:h-56 relative z-10" />
        </motion.div>
      </AnimatePresence>
      
      {/* Stage info */}
      <motion.div 
        className="text-center mt-4 space-y-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className={`font-heading text-xl font-semibold ${info.color}`}>
          {info.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {info.subtitle}
        </p>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          {info.description}
        </p>
      </motion.div>
      
      {/* LF Balance display */}
      <motion.div 
        className={`mt-4 px-4 py-2 rounded-full ${info.bgColor}`}
        whileHover={{ scale: 1.05 }}
      >
        <span className={`font-heading font-bold ${info.color}`}>
          ${saldos.LF.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-sm text-muted-foreground ml-1">USD</span>
      </motion.div>
    </div>
  );
};

export default PlantVisualization;
