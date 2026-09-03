import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import LoginPage from '../pages/Login'
import RegisterPage from '../pages/Register'
import ProfilePage from '../pages/Profile'
import DashboardPage from '../pages/Dashboard'
import MonitoringPage from '../pages/Monitoring'
import PatientsPage from '../pages/Patients'
import PatientDetailsPage from '../pages/PatientDetails'
import RiskPredictionPage from '../pages/RiskPrediction'
import AlertsPage from '../pages/Alerts'
import ClinicalSupportPage from '../pages/ClinicalSupport'
import AnalyticsPage from '../pages/Analytics'
import InventoryPage from '../pages/Inventory'
import SettingsPage from '../pages/Settings'

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/monitoring" element={<MonitoringPage />} />
      <Route path="/patients" element={<PatientsPage />} />
      <Route path="/patients/:id" element={<PatientDetailsPage />} />
      <Route path="/risk-prediction" element={<RiskPredictionPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/clinical-support" element={<ClinicalSupportPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
)

export default AppRoutes
