import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { Dashboard } from './pages/Dashboard';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  return (
    <FinanceProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </HashRouter>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </FinanceProvider>
  );
}

export default App;
