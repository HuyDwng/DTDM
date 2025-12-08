import DashboardLayout from "@/_components/DashboardLayout";
import './dashboard.css'


export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}