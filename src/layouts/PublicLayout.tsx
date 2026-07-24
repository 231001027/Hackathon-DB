import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BgWatermark from '@/components/ui/BgWatermark';

export default function PublicLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <BgWatermark />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
