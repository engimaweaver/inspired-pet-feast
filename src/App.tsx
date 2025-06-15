import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { UserProvider } from '@/contexts/UserContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserProfilePage from './pages/UserProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import MaintenancePage from './pages/MaintenancePage';
import ConnectionErrorPage from './pages/ConnectionErrorPage';
import SearchResultsPage from './pages/SearchResultsPage';
import HelpPage from './pages/HelpPage';
import ReportsOverviewPage from './pages/ReportsOverviewPage';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import NotificationCenterPage from './pages/NotificationCenterPage';

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
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="/maintenance" element={<MaintenancePage />} />
                  <Route path="/connection-error" element={<ConnectionErrorPage />} />
                  
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/search" 
                    element={
                      <ProtectedRoute>
                        <SearchResultsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/help" 
                    element={
                      <ProtectedRoute>
                        <HelpPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/reports" 
                    element={
                      <ProtectedRoute>
                        <ReportsOverviewPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/notifications" 
                    element={
                      <ProtectedRoute>
                        <NotificationCenterPage />
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
