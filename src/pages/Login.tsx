import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    login();
    toast.success("Welcome back!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Simple<span className="text-primary">Bill</span></h1>
          <p className="text-sm text-muted-foreground mt-2">Cash billing made simple</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-12 px-3 border border-input rounded-lg text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-12 px-3 border border-input rounded-lg text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-lg hover:brightness-110 transition-all">Login</button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have a shop?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">Register your shop</Link>
        </p>
      </div>
    </div>
  );
}
