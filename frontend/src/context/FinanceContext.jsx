import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Generate unique ID without external library
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Initial state structure
const initialState = {
  // 6 Jars balances (persisted)
  saldos: {
    NEC: 0,      // Necesidades - 55%
    LF: 0,       // Libertad Financiera - 10%
    ALP: 0,      // Ahorro Largo Plazo - 10%
    EDU: 0,      // Educación - 10%
    PLAY: 0,     // Ocio - 10%
    DAR: 0,      // Dar - 5%
  },
  // Transaction history (all types)
  historial_transacciones: [],
  // LF history for chart
  historial_lf: [],
  // Theme
  theme: 'light',
};

// Jar percentages
export const JAR_PERCENTAGES = {
  NEC: 0.55,
  LF: 0.10,
  ALP: 0.10,
  EDU: 0.10,
  PLAY: 0.10,
  DAR: 0.05,
};

// Jar metadata
export const JAR_INFO = {
  NEC: { 
    name: 'Necesidades', 
    percentage: 55, 
    icon: 'Home',
    description: 'Gastos esenciales del día a día',
    colorClass: 'jar-nec'
  },
  LF: { 
    name: 'Libertad Financiera', 
    percentage: 10, 
    icon: 'TrendingUp',
    description: 'Inversiones para tu futuro',
    colorClass: 'jar-lf'
  },
  ALP: { 
    name: 'Ahorro Largo Plazo', 
    percentage: 10, 
    icon: 'PiggyBank',
    description: 'Metas grandes y emergencias',
    colorClass: 'jar-alp'
  },
  EDU: { 
    name: 'Educación', 
    percentage: 10, 
    icon: 'GraduationCap',
    description: 'Cursos, libros y aprendizaje',
    colorClass: 'jar-edu'
  },
  PLAY: { 
    name: 'Ocio', 
    percentage: 10, 
    icon: 'PartyPopper',
    description: 'Diversión y entretenimiento',
    colorClass: 'jar-play'
  },
  DAR: { 
    name: 'Dar', 
    percentage: 5, 
    icon: 'Heart',
    description: 'Donaciones y regalos',
    colorClass: 'jar-dar'
  },
};

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME_DISTRIBUTED: 'INCOME_DISTRIBUTED',  // Ingreso distribuido en 6 jarros
  INCOME_DIRECT: 'INCOME_DIRECT',            // Ingreso directo a un jarro
  WITHDRAWAL: 'WITHDRAWAL',                   // Retiro de un jarro
};

// Action types
const ACTIONS = {
  ADD_INCOME: 'ADD_INCOME',
  ADD_DIRECT_INCOME: 'ADD_DIRECT_INCOME',
  WITHDRAW_FROM_JAR: 'WITHDRAW_FROM_JAR',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_THEME: 'SET_THEME',
  LOAD_STATE: 'LOAD_STATE',
  IMPORT_BACKUP: 'IMPORT_BACKUP',
};

// Reducer function
function financeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_INCOME: {
      const { monto, descripcion } = action.payload;
      const timestamp = new Date();
      
      // Calculate distribution
      const distribution = {};
      Object.keys(JAR_PERCENTAGES).forEach(jar => {
        distribution[jar] = monto * JAR_PERCENTAGES[jar];
      });
      
      // Create transaction record
      const transaction = {
        id: generateId(),
        type: TRANSACTION_TYPES.INCOME_DISTRIBUTED,
        fecha: timestamp.toISOString(),
        monto: monto,
        descripcion: descripcion,
        distribution: distribution,
        jar: null, // Distributed to all
      };
      
      // Calculate new balances
      const newSaldos = { ...state.saldos };
      Object.keys(distribution).forEach(jar => {
        newSaldos[jar] = (newSaldos[jar] || 0) + distribution[jar];
      });
      
      // Add LF history point
      const newHistorialLF = [
        ...state.historial_lf,
        {
          fecha: timestamp.toISOString(),
          saldo: newSaldos.LF,
        }
      ];
      
      return {
        ...state,
        saldos: newSaldos,
        historial_transacciones: [transaction, ...state.historial_transacciones],
        historial_lf: newHistorialLF,
      };
    }
    
    case ACTIONS.ADD_DIRECT_INCOME: {
      const { monto, descripcion, jar } = action.payload;
      const timestamp = new Date();
      
      // Create transaction record
      const transaction = {
        id: generateId(),
        type: TRANSACTION_TYPES.INCOME_DIRECT,
        fecha: timestamp.toISOString(),
        monto: monto,
        descripcion: descripcion,
        distribution: null,
        jar: jar,
      };
      
      // Calculate new balance for specific jar
      const newSaldos = { ...state.saldos };
      newSaldos[jar] = (newSaldos[jar] || 0) + monto;
      
      // Update LF history if it's LF jar
      let newHistorialLF = state.historial_lf;
      if (jar === 'LF') {
        newHistorialLF = [
          ...state.historial_lf,
          {
            fecha: timestamp.toISOString(),
            saldo: newSaldos.LF,
          }
        ];
      }
      
      return {
        ...state,
        saldos: newSaldos,
        historial_transacciones: [transaction, ...state.historial_transacciones],
        historial_lf: newHistorialLF,
      };
    }
    
    case ACTIONS.WITHDRAW_FROM_JAR: {
      const { monto, descripcion, jar } = action.payload;
      const timestamp = new Date();
      
      // Check if enough balance
      if (state.saldos[jar] < monto) {
        return state; // Not enough balance
      }
      
      // Create transaction record
      const transaction = {
        id: generateId(),
        type: TRANSACTION_TYPES.WITHDRAWAL,
        fecha: timestamp.toISOString(),
        monto: monto,
        descripcion: descripcion,
        distribution: null,
        jar: jar,
      };
      
      // Calculate new balance for specific jar
      const newSaldos = { ...state.saldos };
      newSaldos[jar] = Math.max(0, (newSaldos[jar] || 0) - monto);
      
      // Update LF history if it's LF jar
      let newHistorialLF = state.historial_lf;
      if (jar === 'LF') {
        newHistorialLF = [
          ...state.historial_lf,
          {
            fecha: timestamp.toISOString(),
            saldo: newSaldos.LF,
          }
        ];
      }
      
      return {
        ...state,
        saldos: newSaldos,
        historial_transacciones: [transaction, ...state.historial_transacciones],
        historial_lf: newHistorialLF,
      };
    }
    
    case ACTIONS.DELETE_TRANSACTION: {
      const { transactionId } = action.payload;
      const transaction = state.historial_transacciones.find(t => t.id === transactionId);
      
      if (!transaction) return state;
      
      const newSaldos = { ...state.saldos };
      
      // Reverse based on transaction type
      if (transaction.type === TRANSACTION_TYPES.INCOME_DISTRIBUTED) {
        // Reverse the distribution (subtract from all jars)
        Object.keys(transaction.distribution).forEach(jar => {
          newSaldos[jar] = Math.max(0, (newSaldos[jar] || 0) - transaction.distribution[jar]);
        });
      } else if (transaction.type === TRANSACTION_TYPES.INCOME_DIRECT) {
        // Subtract from specific jar
        newSaldos[transaction.jar] = Math.max(0, (newSaldos[transaction.jar] || 0) - transaction.monto);
      } else if (transaction.type === TRANSACTION_TYPES.WITHDRAWAL) {
        // Add back to specific jar (reverse withdrawal)
        newSaldos[transaction.jar] = (newSaldos[transaction.jar] || 0) + transaction.monto;
      }
      
      // Remove transaction
      const newHistorial = state.historial_transacciones.filter(t => t.id !== transactionId);
      
      // Update LF history
      const timestamp = new Date();
      const newHistorialLF = [
        ...state.historial_lf,
        {
          fecha: timestamp.toISOString(),
          saldo: newSaldos.LF,
        }
      ];
      
      return {
        ...state,
        saldos: newSaldos,
        historial_transacciones: newHistorial,
        historial_lf: newHistorialLF,
      };
    }
    
    case ACTIONS.SET_THEME: {
      return {
        ...state,
        theme: action.payload,
      };
    }
    
    case ACTIONS.LOAD_STATE: {
      return {
        ...initialState,
        ...action.payload,
      };
    }
    
    case ACTIONS.IMPORT_BACKUP: {
      return {
        ...initialState,
        ...action.payload,
        theme: state.theme, // Keep current theme
      };
    }
    
    default:
      return state;
  }
}

// Create context
const FinanceContext = createContext(null);

// Storage key
const STORAGE_KEY = 'jarras_finanzas_state';

// Provider component
export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  
  // Load persisted state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        dispatch({ type: ACTIONS.LOAD_STATE, payload: parsedState });
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  }, []);
  
  // Persist state on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [state]);
  
  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);
  
  // Action creators
  const addIncome = (monto, descripcion) => {
    dispatch({
      type: ACTIONS.ADD_INCOME,
      payload: { monto, descripcion },
    });
  };
  
  const addDirectIncome = (monto, descripcion, jar) => {
    dispatch({
      type: ACTIONS.ADD_DIRECT_INCOME,
      payload: { monto, descripcion, jar },
    });
  };
  
  const withdrawFromJar = (monto, descripcion, jar) => {
    if (state.saldos[jar] < monto) {
      return false; // Not enough balance
    }
    dispatch({
      type: ACTIONS.WITHDRAW_FROM_JAR,
      payload: { monto, descripcion, jar },
    });
    return true;
  };
  
  const deleteTransaction = (transactionId) => {
    dispatch({
      type: ACTIONS.DELETE_TRANSACTION,
      payload: { transactionId },
    });
  };
  
  const toggleTheme = () => {
    dispatch({
      type: ACTIONS.SET_THEME,
      payload: state.theme === 'light' ? 'dark' : 'light',
    });
  };
  
  // Export backup data
  const exportBackup = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: {
        saldos: state.saldos,
        historial_transacciones: state.historial_transacciones,
        historial_lf: state.historial_lf,
      }
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_6jarros_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Import backup data
  const importBackup = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backupData = JSON.parse(e.target.result);
          
          // Validate backup structure
          if (!backupData.data || !backupData.data.saldos) {
            throw new Error('Formato de backup inválido');
          }
          
          dispatch({
            type: ACTIONS.IMPORT_BACKUP,
            payload: backupData.data,
          });
          
          resolve(backupData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsText(file);
    });
  };
  
  // Calculate total balance
  const totalBalance = Object.values(state.saldos).reduce((sum, val) => sum + val, 0);
  
  // Get plant stage based on LF balance
  const getPlantStage = () => {
    const lfBalance = state.saldos.LF;
    if (lfBalance <= 100) return 'seed';
    if (lfBalance <= 1000) return 'sprout';
    return 'tree';
  };
  
  const value = {
    state,
    saldos: state.saldos,
    historial: state.historial_transacciones,
    historialLF: state.historial_lf,
    theme: state.theme,
    totalBalance,
    plantStage: getPlantStage(),
    addIncome,
    addDirectIncome,
    withdrawFromJar,
    deleteTransaction,
    toggleTheme,
    exportBackup,
    importBackup,
  };
  
  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

// Custom hook
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

export default FinanceContext;
