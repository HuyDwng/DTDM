'use client'
import { usePathname } from 'next/navigation';
import MainLayout from './MainLayout';

export default function LayoutWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register' ;
  const isDashboardPage = pathname.startsWith('/dashboard'); // ✅ Quan trọng!

  if (isAuthPage || isDashboardPage) {
    return <>{children}</>; // Không có MainLayout
  }

  return <MainLayout>{children}</MainLayout>; // Các trang khác: có MainLayout
}