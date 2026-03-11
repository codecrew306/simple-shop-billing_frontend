import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ shopName: "", ownerName: "", email: "", password: "", phone: "" });
  const { login } = useApp();
  const navigate = useNavigate();

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shopName || !form.ownerName || !form.email || !form.password) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login();
      toast.success("Shop registered successfully! Your Store ID: SHOP-7X9K2M");
      navigate("/dashboard");
    }, 1500);
  };

  const inputClass = "w-full h-12 px-3 border border-input rounded-lg text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Simple<span className="text-primary">Bill</span></h1>
          <p className="text-sm text-muted-foreground mt-2">Register your shop</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Shop Name*</label>
            <input value={form.shopName} onChange={e => set("shopName", e.target.value)} className={inputClass} placeholder="My Grocery Store" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Owner Name*</label>
            <input value={form.ownerName} onChange={e => set("ownerName", e.target.value)} className={inputClass} placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Email*</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass} placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Password*</label>
            <input type="password" value={form.password} onChange={e => set("password", e.target.value)} className={inputClass} placeholder="••••••••" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Phone (Optional)</label>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} className={inputClass} placeholder="+91 98765 43210" />
          </div>
          <button type="submit" disabled={loading} className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Registering..." : "Register Shop"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
