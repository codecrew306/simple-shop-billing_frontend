import { useState } from "react";
import { useApp, type CartItem } from "@/context/AppContext";
import { toast } from "sonner";
import { Plus, Minus, X, ChevronDown, ChevronUp, Camera } from "lucide-react";
import AddProductModal from "@/components/modals/AddProductModal";
import ReceiptModal from "@/components/modals/ReceiptModal";

const SAMPLE_PRODUCTS = [
  { id: "p1", name: "Milk 2L", price: 60, barcode: "8901234567890" },
  { id: "p2", name: "Bread", price: 40, barcode: "8901234567891" },
  { id: "p3", name: "Rice 5kg", price: 630, barcode: "8901234567892" },
  { id: "p4", name: "Eggs (6 pcs)", price: 60, barcode: "8901234567893" },
  { id: "p5", name: "Sugar 1kg", price: 45, barcode: "8901234567894" },
  { id: "p6", name: "Tea 250g", price: 180, barcode: "8901234567895" },
];

export default function Billing() {
  const { cart, addToCart, updateCartQuantity, removeFromCart, clearCart, addTransaction, addTab } = useApp();
  const [showCustomer, setShowCustomer] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cash = parseFloat(cashReceived) || 0;
  const change = cash > 0 ? cash - subtotal : 0;
  const insufficientCash = cash > 0 && cash < subtotal;

  const simulateScan = () => {
    const product = SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)];
    addToCart(product);
    toast.success(`Product added: ${product.name}`);
  };

  const simulateError = () => {
    toast.error("Scan failed. Please try again or enter manually.");
  };

  const handleMarkPaid = () => {
    if (cart.length === 0) { toast.error("Cart is empty"); return; }
    if (insufficientCash) return;

    const tx = {
      id: `t-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      customer: customerName || "Walk-in",
      phone: customerPhone,
      items: [...cart],
      total: subtotal,
      payment: "Cash",
    };
    addTransaction(tx);
    setLastTransaction(tx);
    toast.success("Bill marked as paid");
    clearCart();
    setCashReceived("");
    setCustomerName("");
    setCustomerPhone("");
    setShowReceipt(true);
  };

  const handleSaveTab = () => {
    if (cart.length === 0) { toast.error("Cart is empty"); return; }
    if (!customerName) { toast.error("Customer name required for tabs"); return; }
    addTab({
      id: `tab-${Date.now()}`,
      customer: customerName,
      phone: customerPhone,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      items: [...cart],
      total: subtotal,
      paid: 0,
    });
    toast.success("Saved as tab");
    clearCart();
    setCashReceived("");
    setCustomerName("");
    setCustomerPhone("");
  };

  const handleAddProduct = (product: { name: string; price: number; barcode: string }) => {
    const item = { id: `p-${Date.now()}`, ...product };
    addToCart(item);
    toast.success("Product added to database");
    setShowAddProduct(false);
  };

  const inputClass = "w-full h-12 px-3 border border-input rounded-lg text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background";

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      {/* Scanner */}
      <section className="bg-card rounded-xl p-4 card-shadow">
        <div className="flex items-center justify-center h-28 bg-muted rounded-lg mb-3">
          <div className="text-center text-muted-foreground">
            <Camera size={32} className="mx-auto mb-1 opacity-50" />
            <p className="text-xs">Tap to scan barcode</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={simulateScan} className="flex-1 min-w-[100px] h-10 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:brightness-110 transition-all">Simulate Scan</button>
          <button onClick={() => setShowAddProduct(true)} className="flex-1 min-w-[100px] h-10 border border-primary text-foreground rounded-lg text-xs font-semibold hover:bg-muted transition-colors">New Product</button>
          <button onClick={simulateError} className="flex-1 min-w-[100px] h-10 border border-destructive text-destructive rounded-lg text-xs font-semibold hover:bg-destructive/5 transition-colors">Scan Error</button>
        </div>
      </section>

      {/* Customer */}
      <section className="bg-card rounded-xl card-shadow">
        <button onClick={() => setShowCustomer(!showCustomer)} className="w-full flex items-center justify-between p-4 text-sm font-medium text-foreground">
          <span>Customer (Optional)</span>
          {showCustomer ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showCustomer && (
          <div className="px-4 pb-4 space-y-3">
            <input value={customerName} onChange={e => setCustomerName(e.target.value)} className={inputClass} placeholder="Customer Name" />
            <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className={inputClass} placeholder="Phone Number" />
            <p className="text-[11px] text-muted-foreground">Phone number is only used for bill sharing and tabs. No marketing.</p>
          </div>
        )}
      </section>

      {/* Cart */}
      <section>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Cart</h3>
        {cart.length === 0 ? (
          <div className="bg-card rounded-xl p-8 card-shadow text-center">
            <p className="text-muted-foreground text-sm">Scan your first product</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl card-shadow divide-y divide-border">
            {cart.map(item => (
              <div key={item.id} className="p-3 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">₹{item.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateCartQuantity(item.id, -1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors"><Minus size={14} /></button>
                  <span className="text-sm font-semibold font-mono w-6 text-center text-foreground">{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.id, 1)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors"><Plus size={14} /></button>
                  <span className="text-sm font-semibold font-mono w-16 text-right text-foreground">₹{(item.price * item.quantity).toLocaleString()}</span>
                  <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-full hover:bg-destructive/10 flex items-center justify-center text-destructive transition-colors"><X size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Totals & Payment */}
      {cart.length > 0 && (
        <section className="bg-card rounded-xl p-4 card-shadow space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold font-mono text-foreground">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-border pt-3">
            <span className="text-foreground">Total</span>
            <span className="font-mono text-foreground">₹{subtotal.toLocaleString()}</span>
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-1">Cash Received (Optional)</label>
            <input value={cashReceived} onChange={e => setCashReceived(e.target.value)} className={inputClass} placeholder="₹0" type="number" />
          </div>
          {cash > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Change Due</span>
              <span className={`font-semibold font-mono ${insufficientCash ? "text-destructive" : "text-success"}`}>
                {insufficientCash ? "Insufficient cash" : `₹${change.toLocaleString()}`}
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={handleMarkPaid} disabled={insufficientCash} className="flex-1 h-12 bg-primary text-primary-foreground font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Mark as Paid</button>
            <button onClick={handleSaveTab} className="flex-1 h-12 border border-primary text-foreground font-semibold rounded-lg hover:bg-muted transition-colors">Save as Tab</button>
          </div>
        </section>
      )}

      <AddProductModal open={showAddProduct} onClose={() => setShowAddProduct(false)} onSave={handleAddProduct} />
      {lastTransaction && <ReceiptModal open={showReceipt} onClose={() => setShowReceipt(false)} transaction={lastTransaction} />}
    </div>
  );
}
