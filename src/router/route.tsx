import { Routes, Route, Navigate } from 'react-router-dom';
import HomepagePage from '@/app/client/homepage/page';
import TheArenaPage from '@/app/client/the-arena/page';
import MembershipPage from '@/app/client/membership/page';
import ContactPage from '@/app/client/contact/page';
import BookNowPage from '@/app/client/book-now/page';
import AdminDashboardPage from '@/app/admin/page';
import NotFound from '@/app/not-found';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/homepage" replace />} />

      {/* Client routes */}
      <Route path="/homepage" element={<HomepagePage />} />
      <Route path="/the-arena" element={<TheArenaPage />} />
      <Route path="/membership" element={<MembershipPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/book-now" element={<BookNowPage />} />

      {/* Admin routes (protected) */}
      <Route
        path="/admin-dashboard"
        element={<Navigate to="/admin-dashboard/home" replace />}
      />
      <Route
        path="/admin-dashboard/:section"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
