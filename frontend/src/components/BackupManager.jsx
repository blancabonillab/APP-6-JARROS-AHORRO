import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
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
import { Download, Upload, Database, AlertTriangle, Check, FileJson } from 'lucide-react';
import { toast } from 'sonner';

export const BackupManager = () => {
  const { exportBackup, importBackup, historial, totalBalance } = useFinance();
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  
  const handleExport = () => {
    exportBackup();
    toast.success('¡Backup descargado!', {
      description: 'Guarda este archivo en un lugar seguro',
    });
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.json')) {
        toast.error('Archivo inválido', {
          description: 'Por favor selecciona un archivo .json',
        });
        return;
      }
      setPendingFile(file);
    }
  };
  
  const handleImportConfirm = async () => {
    if (!pendingFile) return;
    
    setIsImporting(true);
    try {
      const backupData = await importBackup(pendingFile);
      toast.success('¡Backup restaurado!', {
        description: `Datos del ${new Date(backupData.exportDate).toLocaleDateString('es-ES')} restaurados correctamente`,
      });
      setPendingFile(null);
    } catch (error) {
      toast.error('Error al restaurar', {
        description: error.message || 'El archivo no es válido',
      });
    }
    setIsImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleImportCancel = () => {
    setPendingFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Respaldo de Datos
        </CardTitle>
        <CardDescription>
          Exporta tus datos para guardarlos o restaurarlos en otro dispositivo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">Transacciones</p>
            <p className="font-heading font-bold text-foreground">{historial.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">Balance Total</p>
            <p className="font-heading font-bold text-foreground">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Export Button */}
          <Button 
            onClick={handleExport}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar Backup
          </Button>
          
          {/* Import Button */}
          <AlertDialog open={!!pendingFile} onOpenChange={(open) => !open && handleImportCancel()}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                Restaurar Backup
              </Button>
            </AlertDialogTrigger>
            
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  ¿Restaurar backup?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <span className="block">
                    Esta acción reemplazará <strong>todos tus datos actuales</strong> con los del archivo de backup.
                  </span>
                  {pendingFile && (
                    <span className="flex items-center gap-2 text-foreground bg-muted p-2 rounded">
                      <FileJson className="w-4 h-4" />
                      {pendingFile.name}
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleImportCancel}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleImportConfirm}
                  disabled={isImporting}
                  className="bg-primary"
                >
                  {isImporting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                    />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {isImporting ? 'Restaurando...' : 'Restaurar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Tus datos permanecen 100% en tu dispositivo
        </p>
      </CardContent>
    </Card>
  );
};

export default BackupManager;
