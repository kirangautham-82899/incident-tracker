import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import MapPage from './pages/MapPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import LandingPage from './pages/LandingPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import useAuthStore from './stores/authStore';
import useIncidentStore from './stores/incidentStore';
import socketService from './utils/socket';
import notificationService from './utils/notificationService';
import { ThemeProvider } from './contexts/ThemeContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { addIncident, updateIncident } = useIncidentStore();

  useEffect(() => {
    // Request notification permission on app load
    if (notificationService.isNotificationSupported()) {
      notificationService.requestPermission();
    }

    // Connect to Socket.IO server
    socketService.connect();

    // Listen for new incidents
    socketService.on('incident_created', (incident) => {
      console.log('📡 New incident received:', incident);
      addIncident(incident);
      toast.success('New incident reported!');

      // Show push notification for nearby/critical incidents
      if (incident.severity === 'critical' || incident.severity === 'high') {
        notificationService.notifyNewIncident(incident);
      }
    });

    // Listen for incident updates
    socketService.on('incident_updated', (incident) => {
      console.log('📡 Incident updated:', incident);
      updateIncident(incident);
      toast('Incident updated', { icon: '🔄' });
      notificationService.notifyStatusUpdate(incident, incident.status);
    });

    // Listen for verification updates
    socketService.on('incident_verified', (incident) => {
      console.log('📡 Incident verified:', incident);
      updateIncident(incident);
      toast.success('Incident verified!');
      notificationService.notifyVerification(incident);
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [addIncident, updateIncident]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#363636',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/map" element={<MapPage />} />

          {/* Protected Routes */}
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
