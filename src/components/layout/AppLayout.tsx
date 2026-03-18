import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Receipt, FileText, ArrowLeftRight, Settings } from "lucide-react";
import { useApp } from "@/context/AppContext";

const NAV_ITEMS = [
  { path: "/dashboard", icon: Home, label: "Home" },
  { path: "/billing", icon: Receipt, label: "Billing" },
  { path: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { path: "/tabs", icon: FileText, label: "Tabs" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

const SIDEBAR_ITEMS = [
  { path: "/dashboard", icon: Home, label: "Dashboard" },
  { path: "/billing", icon: Receipt, label: "Billing" },
  { path: "/transactions", icon: FileText, label: "Transactions" },
  { path: "/tabs", icon: FileText, label: "Tabs" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { storeName, storeId } = useApp();

  const pageTitle = (() => {
    const match = [...SIDEBAR_ITEMS].find(i => location.pathname.startsWith(i.path));
    return match?.label || "SimpleBill";
  })();

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-navy-deep text-sidebar-foreground fixed h-full z-30">
        <div className="p-5 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-primary">SimpleBill</h1>
        </div>
        <nav className="flex-1 py-4">
          {SIDEBAR_ITEMS.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${active ? "border-l-3 border-primary text-primary bg-sidebar-accent" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-5 border-t border-sidebar-border">
          <p className="text-sm font-medium text-sidebar-foreground">{storeName}</p>
          <span className="text-xs text-primary font-medium">Owner</span>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-60 pb-20 md:pb-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{pageTitle}</h2>
          <span className="text-xs text-muted-foreground font-mono">{storeId}</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex items-center justify-around h-16 z-30 card-shadow">
        {NAV_ITEMS.map(item => {
          const active = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              <item.icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
