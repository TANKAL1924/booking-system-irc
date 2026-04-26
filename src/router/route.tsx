import { Routes, Route, Navigate } from 'react-router-dom';
import HomepagePage from '@/app/client/homepage/page';
import TheArenaPage from '@/app/client/the-arena/page';
import MembershipPage from '@/app/client/membership/page';
import ContactPage from '@/app/client/contact/page';
import AdminDashboardPage from '@/app/admin/page';
import NotFound from '@/app/not-found';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/homepage" replace />} />
      <Route path="/homepage" element={<HomepagePage />} />
      <Route path="/the-arena" element={<TheArenaPage />} />
      <Route path="/membership" element={<MembershipPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
