import "../globals.css"; // Import globals.css ở đây
import Header from "./layout/header";
import Footer from "./layout/footer";

export default function MainLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}