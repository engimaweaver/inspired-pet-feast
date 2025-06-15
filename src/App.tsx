
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/LanguageContext';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
