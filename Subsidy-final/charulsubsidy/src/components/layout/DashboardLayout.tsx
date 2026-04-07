import { ReactNode } from "react";
import { Header } from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Chatbot from "../ui/Chatbot";

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole?: 'citizen' | 'admin' | 'investigator';
}

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 animate-fade-in">
        {children}
         <Chatbot />
      </main>
    </div>
  );
}
