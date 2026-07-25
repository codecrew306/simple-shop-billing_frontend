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
      {/* Desktop sidebar — paper strip, hairline divider */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground fixed h-full z-30 border-r border-sidebar-border">
        <div className="px-7 py-8">
          <h1 className="font-serif text-3xl leading-none text-foreground">SimpleBill</h1>
          <p className="label-caps mt-2">Est. Ledger</p>
        </div>
        <nav className="flex-1 px-3 space-y-0.5">
          {SIDEBAR_ITEMS.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"}`}
              >
                <span className={`inline-block w-1 h-4 ${active ? "bg-foreground" : "bg-transparent"}`} />
                <item.icon size={16} strokeWidth={1.75} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="px-7 py-6 border-t border-sidebar-border">
          <p className="label-caps mb-1">Operator</p>
          <p className="text-sm font-semibold text-foreground">{storeName}</p>
          <p className="text-xs text-muted-foreground">Owner</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 pb-20 md:pb-0">
        {/* Top bar — editorial masthead */}
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-6 md:px-10 py-5 flex items-end justify-between">
          <div>
            <p className="label-caps mb-1">SimpleBill / {pageTitle}</p>
            <h2 className="font-serif text-3xl md:text-4xl leading-none text-foreground">{pageTitle}</h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono tabular hidden sm:inline">№ {storeId}</span>
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
