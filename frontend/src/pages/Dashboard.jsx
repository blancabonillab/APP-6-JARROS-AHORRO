import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { PlantVisualization } from '../components/PlantVisualization';
import { JarCard } from '../components/JarCard';
import { AddIncomeForm } from '../components/AddIncomeForm';
import { TransactionHistory } from '../components/TransactionHistory';
import { LFChart } from '../components/LFChart';
import { useFinance, JAR_INFO } from '../context/FinanceContext';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Sprout, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';

const jarOrder = ['NEC', 'LF', 'ALP', 'EDU', 'PLAY', 'DAR'];

export const Dashboard = () => {
  const { saldos, totalBalance } = useFinance();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Hero Section with Plant */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-muted/30">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left - Info */}
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Sprout className="w-5 h-5 text-success" />
                    <h2 className="font-heading text-xl font-semibold text-foreground">
                      Tu Planta de la Riqueza
                    </h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">
                            Tu planta crece según tu saldo de <strong>Libertad Financiera</strong>.
                            <br /><br />
                            🌱 Semilla: $0 - $100<br />
                            🌿 Brote: $101 - $1,000<br />
                            🌳 Árbol: +$1,000
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Observa cómo crece tu planta a medida que aumentas tu jarro de 
                    <span className="text-success font-medium"> Libertad Financiera</span>. 
                    ¡Cuida tus finanzas y tu planta florecerá!
                  </p>
                  
                  <AddIncomeForm />
                </div>
                
                {/* Right - Plant */}
                <div className="order-1 md:order-2 flex justify-center">
                  <PlantVisualization />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
        
        {/* 6 Jars Grid */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Tus 6 Jarros
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ¿Cómo funciona?
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-sm">
                  <p className="text-sm">
                    El sistema de <strong>6 Jarros</strong> distribuye automáticamente cada ingreso:
                    <br /><br />
                    • 55% Necesidades<br />
                    • 10% Libertad Financiera<br />
                    • 10% Ahorro Largo Plazo<br />
                    • 10% Educación<br />
                    • 10% Ocio<br />
                    • 5% Dar
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {jarOrder.map((jarKey, index) => (
              <JarCard
                key={jarKey}
                jarKey={jarKey}
                balance={saldos[jarKey]}
                totalBalance={totalBalance}
                index={index}
              />
            ))}
          </div>
        </motion.section>
        
        <Separator className="mb-8" />
        
        {/* Chart and History Grid */}
        <motion.section 
          className="grid lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* LF Chart */}
          <LFChart />
          
          {/* Transaction History */}
          <TransactionHistory />
        </motion.section>
        
        {/* Footer */}
        <footer className="mt-12 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Tus datos permanecen 100% en tu dispositivo
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Sistema de los 6 Jarros • Privacidad Total
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
