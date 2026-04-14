import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './hooks/useAuth';
import { SiteProvider } from './context/SiteContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import WebsitePage from './pages/dashboard/WebsitePage';
import EditorPage from './pages/dashboard/EditorPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import SupportPage from './pages/dashboard/SupportPage';
import BillingPage from './pages/dashboard/BillingPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import PublicLandingPage from './pages/PublicLandingPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              {/* Páginas legales */}
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* Ruta pública de landing pages creadas */}
              <Route path="/landing/:slug" element={<PublicLandingPage />} />

              {/* Rutas protegidas del Panel */}
              <Route path="/panel" element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="website" element={<WebsitePage />} />
                  <Route path="website/editor" element={<EditorPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="support" element={<SupportPage />} />
                  <Route path="billing" element={<BillingPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </SiteProvider>
    </AuthProvider>
  );
}

export default App;
