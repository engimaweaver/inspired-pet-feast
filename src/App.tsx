
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { UserProvider } from '@/contexts/UserContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <LanguageProvider>
          <SearchProvider>
            <Router>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </SearchProvider>
        </LanguageProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
