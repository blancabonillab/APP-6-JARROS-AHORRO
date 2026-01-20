import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useFinance } from '../context/FinanceContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="text-xs text-muted-foreground mb-1">
          {format(new Date(label), "d MMM yyyy, HH:mm", { locale: es })}
        </p>
        <p className="font-heading font-bold text-success">
          ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export const LFChart = () => {
  const { historialLF, saldos } = useFinance();
  
  // Prepare chart data
  const chartData = historialLF.length > 0 
    ? historialLF.map(item => ({
        fecha: item.fecha,
        saldo: item.saldo,
      }))
    : [{ fecha: new Date().toISOString(), saldo: 0 }];
  
  // Calculate growth
  const firstValue = chartData[0]?.saldo || 0;
  const lastValue = chartData[chartData.length - 1]?.saldo || 0;
  const growth = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Libertad Financiera
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Tendencia de crecimiento
            </p>
          </div>
          <div className="text-right">
            <motion.p 
              className="font-heading text-2xl font-bold text-success"
              key={saldos.LF}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              ${saldos.LF.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.p>
            {growth !== 0 && (
              <p className={`text-sm ${growth > 0 ? 'text-success' : 'text-destructive'}`}>
                {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {historialLF.length < 2 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">
              Agrega más ingresos para ver la tendencia
            </p>
          </motion.div>
        ) : (
          <div className="h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="fecha" 
                  tickFormatter={(value) => format(new Date(value), 'd/M')}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="saldo"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSaldo)"
                  dot={false}
                  activeDot={{ r: 6, fill: 'hsl(var(--success))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LFChart;
