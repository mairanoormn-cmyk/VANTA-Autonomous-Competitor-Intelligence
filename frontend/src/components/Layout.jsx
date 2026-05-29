import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  // Dashboard is a full-screen app — hide footer there
  const hideFooter = location.pathname === '/dashboard';

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
