import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from '../features/landing/LandingPage';
import AuthPage from '../features/auth/AuthPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import FarmerDashboard from '../features/farmer/FarmerDashboard';
import FarmerProducts from '../features/farmer/FarmerProducts';
import FarmerRequests from '../features/farmer/FarmerRequests';
import BuyerDashboard from '../features/buyer/BuyerDashboard';
import Marketplace from '../features/marketplace/Marketplace';
import ProductDetails from '../features/marketplace/ProductDetails';
import BuyerRequests from '../features/requests/BuyerRequests';
import AdminDashboard from '../features/admin/AdminDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />

      <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer-products" element={<FarmerProducts />} />
        <Route path="/farmer-requests" element={<FarmerRequests />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/buyer-requests" element={<BuyerRequests />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['farmer', 'buyer']} />}>
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<AdminDashboard />} />
        <Route path="/admin-products" element={<AdminDashboard />} />
        <Route path="/admin-requests" element={<AdminDashboard />} />
        <Route path="/admin-reports" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
