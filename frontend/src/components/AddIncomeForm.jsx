import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from './ui/dialog';
import { useFinance, JAR_INFO, JAR_PERCENTAGES } from '../context/FinanceContext';
import { Plus, DollarSign, FileText, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

export const AddIncomeForm = () => {
  const { addIncome } = useFinance();
  const [open, setOpen] = useState(false);
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const montoNum = parseFloat(monto) || 0;
  
  // Calculate distribution preview
  const distribution = Object.entries(JAR_PERCENTAGES).map(([key, percentage]) => ({
    key,
    name: JAR_INFO[key].name,
    amount: montoNum * percentage,
    percentage: percentage * 100,
  }));
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (montoNum <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addIncome(montoNum, descripcion || 'Ingreso');
    
    toast.success('¡Ingreso registrado!', {
      description: `$${montoNum.toLocaleString('en-US', { minimumFractionDigits: 2 })} distribuido en los 6 jarros`,
    });
    
    // Reset form
    setMonto('');
    setDescripcion('');
    setShowPreview(false);
    setIsSubmitting(false);
    setOpen(false);
  };
  
  const handleMontoChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setMonto(value);
      setShowPreview(parseFloat(value) > 0);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="gap-2 shadow-glow hover:shadow-lg transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Agregar Ingreso
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Nuevo Ingreso
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Monto Input */}
          <div className="space-y-2">
            <Label htmlFor="monto" className="text-sm font-medium">
              Monto (USD)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="monto"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={monto}
                onChange={handleMontoChange}
                className="pl-9 text-lg font-heading"
                autoFocus
              />
            </div>
          </div>
          
          {/* Descripcion Input */}
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-sm font-medium">
              Descripción (opcional)
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="descripcion"
                type="text"
                placeholder="Ej: Salario mensual"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="pl-9"
                maxLength={50}
              />
            </div>
          </div>
          
          {/* Distribution Preview */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-dashed">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Vista previa de distribución
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-3">
                    <div className="space-y-2">
                      {distribution.map((item, index) => (
                        <motion.div
                          key={item.key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {item.name} <span className="text-xs">({item.percentage}%)</span>
                          </span>
                          <span className="font-medium text-foreground">
                            ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </motion.div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-dashed flex items-center justify-between">
                        <span className="font-medium text-foreground">Total</span>
                        <span className="font-heading font-bold text-primary">
                          ${montoNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={montoNum <= 0 || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  Procesando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Agregar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIncomeForm;
