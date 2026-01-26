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
import { Minus, DollarSign, FileText, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const WithdrawForm = ({ jarKey, trigger }) => {
  const { withdrawFromJar, saldos } = useFinance();
  const [open, setOpen] = useState(false);
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const jarInfo = JAR_INFO[jarKey];
  const montoNum = parseFloat(monto) || 0;
  const saldoActual = saldos[jarKey] || 0;
  const excedeSaldo = montoNum > saldoActual;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (montoNum <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }
    
    if (excedeSaldo) {
      toast.error('Saldo insuficiente', {
        description: `Solo tienes $${saldoActual.toLocaleString('en-US', { minimumFractionDigits: 2 })} disponibles`,
      });
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const success = withdrawFromJar(montoNum, descripcion || `Retiro - ${jarInfo.name}`, jarKey);
    
    if (success) {
      toast.success('¡Retiro realizado!', {
        description: `$${montoNum.toLocaleString('en-US', { minimumFractionDigits: 2 })} retirado de ${jarInfo.name}`,
      });
      
      setMonto('');
      setDescripcion('');
      setOpen(false);
    } else {
      toast.error('Error al realizar el retiro');
    }
    
    setIsSubmitting(false);
  };
  
  const handleMontoChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setMonto(value);
    }
  };
  
  const handleRetirarTodo = () => {
    setMonto(saldoActual.toFixed(2));
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
            <Minus className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <Minus className="w-5 h-5 text-destructive" />
            Retirar de {jarInfo.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Saldo disponible */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">Saldo disponible</p>
            <p className="font-heading text-xl font-bold text-foreground">
              ${saldoActual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-sm text-muted-foreground ml-1">USD</span>
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="monto-withdraw" className="text-sm font-medium">
                Monto a retirar (USD)
              </Label>
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-xs"
                onClick={handleRetirarTodo}
                disabled={saldoActual <= 0}
              >
                Retirar todo
              </Button>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="monto-withdraw"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={monto}
                onChange={handleMontoChange}
                className={`pl-9 text-lg font-heading ${excedeSaldo ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                autoFocus
              />
            </div>
            {excedeSaldo && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                El monto excede el saldo disponible
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descripcion-withdraw" className="text-sm font-medium">
              Descripción (opcional)
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="descripcion-withdraw"
                type="text"
                placeholder="Ej: Pago de servicios"
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
              disabled={montoNum <= 0 || excedeSaldo || isSubmitting}
              variant="destructive"
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full"
                  />
                  Procesando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Retirar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawForm;
