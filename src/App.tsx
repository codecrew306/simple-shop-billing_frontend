import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/AppContext";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Billing from "@/pages/Billing";
import Transactions from "@/pages/Transactions";
import TabsPage from "@/pages/Tabs";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isLoggedIn } = useApp();

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/tabs" element={<TabsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
