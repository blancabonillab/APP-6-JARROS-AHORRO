import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from './ui/dialog';
import { useFinance, JAR_INFO } from '../context/FinanceContext';
import { Plus, DollarSign, FileText, Check } from 'lucide-react';
import { toast } from 'sonner';

export const DirectIncomeForm = ({ jarKey, trigger }) => {
  const { addDirectIncome } = useFinance();
  const [open, setOpen] = useState(false);
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const jarInfo = JAR_INFO[jarKey];
  const montoNum = parseFloat(monto) || 0;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (montoNum <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addDirectIncome(montoNum, descripcion || `Ingreso extra - ${jarInfo.name}`, jarKey);
    
    toast.success('¡Ingreso agregado!', {
      description: `$${montoNum.toLocaleString('en-US', { minimumFractionDigits: 2 })} añadido a ${jarInfo.name}`,
    });
    
    setMonto('');
    setDescripcion('');
    setIsSubmitting(false);
    setOpen(false);
  };
  
  const handleMontoChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setMonto(value);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success hover:bg-success/10">
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <Plus className="w-5 h-5 text-success" />
            Agregar a {jarInfo.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monto-direct" className="text-sm font-medium">
              Monto (USD)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="monto-direct"
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
          
          <div className="space-y-2">
            <Label htmlFor="descripcion-direct" className="text-sm font-medium">
              Descripción (opcional)
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="descripcion-direct"
                type="text"
                placeholder="Ej: Bono extra"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="pl-9"
                maxLength={50}
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={montoNum <= 0 || isSubmitting}
              className="gap-2 bg-success hover:bg-success/90"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-success-foreground/30 border-t-success-foreground rounded-full"
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

export default DirectIncomeForm;
