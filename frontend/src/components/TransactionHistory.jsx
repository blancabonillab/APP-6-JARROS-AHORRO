import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useFinance } from '../context/FinanceContext';
import { Trash2, History, Calendar, DollarSign, FileText, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

const TransactionItem = ({ transaction, onDelete, index }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onDelete(transaction.id);
    toast.success('Transacción eliminada', {
      description: 'Los saldos han sido actualizados',
    });
  };
  
  const fecha = new Date(transaction.fecha);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <div className={`group flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors duration-200 ${isDeleting ? 'opacity-50' : ''}`}>
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground truncate">
              {transaction.descripcion}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Calendar className="w-3 h-3" />
            <span>
              {format(fecha, "d 'de' MMMM, yyyy - HH:mm", { locale: es })}
            </span>
          </div>
        </div>
        
        {/* Amount */}
        <div className="flex-shrink-0 text-right">
          <p className="font-heading font-bold text-success">
            +${transaction.monto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground">USD</p>
        </div>
        
        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                ¿Eliminar transacción?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción revertirá los saldos de todos los jarros. Se restará 
                <span className="font-medium text-foreground"> ${transaction.monto.toLocaleString('en-US', { minimumFractionDigits: 2 })} </span>
                proporcionalmente de cada jarro.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
};

export const TransactionHistory = () => {
  const { historial, deleteTransaction } = useFinance();
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Historial de Transacciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        {historial.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No hay transacciones
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Agrega tu primer ingreso para comenzar
            </p>
          </motion.div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {historial.map((transaction, index) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={deleteTransaction}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
