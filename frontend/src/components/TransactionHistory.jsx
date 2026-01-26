import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
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
import { useFinance, JAR_INFO, TRANSACTION_TYPES } from '../context/FinanceContext';
import { 
  Trash2, 
  History, 
  Calendar, 
  DollarSign, 
  FileText, 
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Layers
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

const TransactionIcon = ({ type }) => {
  switch (type) {
    case TRANSACTION_TYPES.INCOME_DISTRIBUTED:
      return <Layers className="w-5 h-5 text-primary" />;
    case TRANSACTION_TYPES.INCOME_DIRECT:
      return <ArrowDownCircle className="w-5 h-5 text-success" />;
    case TRANSACTION_TYPES.WITHDRAWAL:
      return <ArrowUpCircle className="w-5 h-5 text-destructive" />;
    default:
      return <DollarSign className="w-5 h-5 text-primary" />;
  }
};

const TransactionBadge = ({ type, jar }) => {
  const getTypeInfo = () => {
    switch (type) {
      case TRANSACTION_TYPES.INCOME_DISTRIBUTED:
        return { label: '6 Jarros', variant: 'default', className: 'bg-primary/10 text-primary border-primary/20' };
      case TRANSACTION_TYPES.INCOME_DIRECT:
        return { label: jar ? JAR_INFO[jar]?.name : 'Ingreso', variant: 'outline', className: 'bg-success/10 text-success border-success/20' };
      case TRANSACTION_TYPES.WITHDRAWAL:
        return { label: jar ? JAR_INFO[jar]?.name : 'Retiro', variant: 'outline', className: 'bg-destructive/10 text-destructive border-destructive/20' };
      default:
        return { label: 'Transacción', variant: 'secondary', className: '' };
    }
  };
  
  const { label, className } = getTypeInfo();
  
  return (
    <Badge variant="outline" className={`text-xs ${className}`}>
      {label}
    </Badge>
  );
};

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
  const isWithdrawal = transaction.type === TRANSACTION_TYPES.WITHDRAWAL;
  
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
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isWithdrawal ? 'bg-destructive/10' : 
          transaction.type === TRANSACTION_TYPES.INCOME_DIRECT ? 'bg-success/10' : 
          'bg-primary/10'
        }`}>
          <TransactionIcon type={transaction.type} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-foreground truncate">
              {transaction.descripcion}
            </p>
            <TransactionBadge type={transaction.type} jar={transaction.jar} />
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
          <p className={`font-heading font-bold ${isWithdrawal ? 'text-destructive' : 'text-success'}`}>
            {isWithdrawal ? '-' : '+'}${transaction.monto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                Esta acción revertirá los saldos. 
                {transaction.type === TRANSACTION_TYPES.INCOME_DISTRIBUTED && (
                  <span> Se restará <strong>${transaction.monto.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> proporcionalmente de cada jarro.</span>
                )}
                {transaction.type === TRANSACTION_TYPES.INCOME_DIRECT && (
                  <span> Se restará <strong>${transaction.monto.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> de {JAR_INFO[transaction.jar]?.name}.</span>
                )}
                {transaction.type === TRANSACTION_TYPES.WITHDRAWAL && (
                  <span> Se devolverá <strong>${transaction.monto.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> a {JAR_INFO[transaction.jar]?.name}.</span>
                )}
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
  
  // Calculate totals
  const totals = historial.reduce((acc, t) => {
    if (t.type === TRANSACTION_TYPES.WITHDRAWAL) {
      acc.egresos += t.monto;
    } else {
      acc.ingresos += t.monto;
    }
    return acc;
  }, { ingresos: 0, egresos: 0 });
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Historial de Transacciones
        </CardTitle>
        
        {/* Totals */}
        {historial.length > 0 && (
          <div className="flex gap-4 mt-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Ingresos: </span>
              <span className="font-medium text-success">
                +${totals.ingresos.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Egresos: </span>
              <span className="font-medium text-destructive">
                -${totals.egresos.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
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
