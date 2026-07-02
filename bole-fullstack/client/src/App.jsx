import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public pages
import HomePage from './pages/public/HomePage';
import { ProductsPage, ProductDetailPage } from './pages/public/ProductsPage';
import { AboutPage, ContactPage, TrackOrderPage } from './pages/public/OtherPages';

// Admin pages
import AdminLoginPage from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminMessages from './pages/admin/AdminMessages';
import AdminInventory from './pages/admin/AdminInventory';
import { AdminBatches, AdminReports, AdminUsers, AdminSettings } from './pages/admin/AdminOtherPages';

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/track" element={<TrackOrderPage />} />

      {/* ── Admin Routes ── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/orders" element={<RequireAuth><AdminOrders /></RequireAuth>} />
      <Route path="/admin/products" element={<RequireAuth><AdminProducts /></RequireAuth>} />
      <Route path="/admin/messages" element={<RequireAuth><AdminMessages /></RequireAuth>} />
      <Route path="/admin/inventory" element={<RequireAuth><AdminInventory /></RequireAuth>} />
      <Route path="/admin/batches" element={<RequireAuth><AdminBatches /></RequireAuth>} />
      <Route path="/admin/reports" element={<RequireAuth><AdminReports /></RequireAuth>} />
      <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
      <Route path="/admin/settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
