import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function SettingsPage() {
  const { storeName, ownerName, storeId, setStoreName, setOwnerName } = useApp();
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("123 Main Street, Mumbai");
  const [currency, setCurrency] = useState("INR (₹)");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const inputClass = "w-full h-12 px-3 border border-input rounded-lg text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background";

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto pb-24">
      {/* Store Information */}
      <section>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Store Information</h3>
        <div className="bg-card rounded-xl p-4 card-shadow space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Store Name</label>
            <input value={storeName} onChange={e => setStoreName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Owner Name</label>
            <input value={ownerName} onChange={e => setOwnerName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Store ID</label>
            <input value={storeId} readOnly className={`${inputClass} bg-muted text-muted-foreground`} />
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Preferences</h3>
        <div className="bg-card rounded-xl p-4 card-shadow">
          <label className="text-sm font-medium text-foreground block mb-1.5">Currency</label>
          <select value={currency} onChange={e => setCurrency(e.target.value)} className={inputClass}>
            <option>INR (₹)</option>
            <option>USD ($)</option>
            <option>EUR (€)</option>
          </select>
        </div>
      </section>

      {/* Data Management */}
      <section>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Data Management</h3>
        <div className="space-y-3">
          <button onClick={() => toast.success("Data exported. Check downloads folder.")} className="w-full h-12 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">Export Data</button>
          <button onClick={() => toast.success("Data imported successfully.")} className="w-full h-12 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">Import Data</button>
          <button onClick={() => setShowResetConfirm(true)} className="w-full h-12 border border-destructive rounded-lg text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors">Reset All Data</button>
        </div>
      </section>

      {/* About */}
      <section className="text-center text-sm text-muted-foreground pb-4">
        <p>Version 1.0.0</p>
        <p>Made with ❤️ for small shops</p>
      </section>

      {/* Reset confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowResetConfirm(false)}>
          <div className="absolute inset-0 bg-foreground/50" />
          <div className="relative bg-background rounded-2xl w-full max-w-sm p-6 card-shadow animate-fade-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowResetConfirm(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={20} /></button>
            <h3 className="text-lg font-semibold text-foreground mb-2">Reset All Data?</h3>
            <p className="text-sm text-muted-foreground mb-5">This will delete all products, transactions, and settings. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 h-11 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => { setShowResetConfirm(false); toast.success("All data has been reset."); }} className="flex-1 h-11 bg-destructive text-destructive-foreground rounded-lg text-sm font-semibold hover:brightness-110 transition-all">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
