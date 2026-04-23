import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';

const queryClient = new QueryClient({ 
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1
    }
  }
});

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <Router>
      {children}
    </Router>
  </QueryClientProvider>
);

export default AppProviders;
