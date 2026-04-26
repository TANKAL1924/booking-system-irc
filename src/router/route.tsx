import { Routes, Route, Navigate } from 'react-router-dom';
import HomepagePage from '@/app/homepage/page';
import TheArenaPage from '@/app/the-arena/page';
import BookNowPage from '@/app/book-now/page';
import MembershipPage from '@/app/membership/page';
import ContactPage from '@/app/contact/page';
import AdminDashboardPage from '@/app/admin-dashboard/page';
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
