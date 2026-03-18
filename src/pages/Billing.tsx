import { useState } from "react";
import { useApp, type CartItem } from "@/context/AppContext";
import { toast } from "sonner";
import { Plus, Minus, X, ChevronDown, ChevronUp, ScanBarcode, Smartphone, User, ShoppingBag, PackagePlus } from "lucide-react";
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

  const simulatePhoneScan = () => {
    const product = SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)];
    addToCart(product);
    toast.success(`Scanned via phone: ${product.name}`);
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
      paid: cash > 0 ? Math.min(cash, subtotal) : 0,
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
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto pb-4">
      {/* Top Header with Add Product */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h1 className="text-lg font-bold text-foreground">New Bill</h1>
          <p className="text-xs text-muted-foreground">
            {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? "s" : ""} in cart` : "Scan to start"}
          </p>
        </div>
        <button
          onClick={() => setShowAddProduct(true)}
          className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:opacity-90 transition-opacity shadow-md"
          title="Add New Product"
        >
          <PackagePlus size={18} />
        </button>
      </div>

      <div className="px-4 space-y-4">
        {/* Scanner Section - Compact pill-style action bar */}
        <section className="bg-card rounded-2xl card-shadow overflow-hidden">
          <div className="bg-gradient-to-br from-[hsl(var(--navy-deep))] to-[hsl(var(--navy-medium))] p-5 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center border-2 border-primary/30">
              <ScanBarcode size={26} className="text-primary" />
            </div>
            <p className="text-xs text-primary/70 font-medium tracking-wide uppercase">Barcode Scanner</p>
          </div>
          <div className="p-3 flex gap-2">
            <button
              onClick={simulateScan}
              className="flex-1 h-11 bg-primary text-primary-foreground rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all active:scale-[0.98]"
            >
              <Zap size={14} />
              Scan
            </button>
            <button
              onClick={simulateError}
              className="h-11 px-4 border border-destructive/30 text-destructive rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-destructive/5 transition-colors active:scale-[0.98]"
            >
              <AlertTriangle size={14} />
              Error
            </button>
          </div>
        </section>

        {/* Customer Toggle */}
        <section className="bg-card rounded-2xl card-shadow overflow-hidden">
          <button
            onClick={() => setShowCustomer(!showCustomer)}
            className="w-full flex items-center justify-between p-4 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <User size={15} className="text-accent" />
              </div>
              <span>Customer Details</span>
            </div>
            <div className="flex items-center gap-2">
              {customerName && <span className="text-xs text-muted-foreground">{customerName}</span>}
              {showCustomer ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
            </div>
          </button>
          {showCustomer && (
            <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
              <input value={customerName} onChange={e => setCustomerName(e.target.value)} className={inputClass} placeholder="Customer Name" />
              <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className={inputClass} placeholder="Phone Number" />
              <p className="text-[11px] text-muted-foreground">Phone number is only used for bill sharing and tabs.</p>
            </div>
          )}
        </section>

        {/* Cart */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <ShoppingBag size={15} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Cart</h3>
            {cart.length > 0 && (
              <span className="ml-auto text-xs font-mono text-muted-foreground">{totalItems} item{totalItems > 1 ? "s" : ""}</span>
            )}
          </div>
          {cart.length === 0 ? (
            <div className="bg-card rounded-2xl p-10 card-shadow text-center border-2 border-dashed border-border">
              <ScanBarcode size={36} className="mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm font-medium">No items yet</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Scan a barcode to add products</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="bg-card rounded-xl card-shadow p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm font-mono shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateCartQuantity(item.id, -1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold font-mono w-5 text-center text-foreground">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, 1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm font-bold font-mono w-14 text-right text-foreground">₹{(item.price * item.quantity).toLocaleString()}</span>
                  <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Payment Section */}
        {cart.length > 0 && (
          <section className="bg-card rounded-2xl card-shadow overflow-hidden">
            {/* Totals */}
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold font-mono text-foreground">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-border pt-3 mt-2">
                <span className="text-foreground">Total</span>
                <span className="font-mono text-primary">₹{subtotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Cash Input */}
            <div className="px-4 pb-4 space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cash Received (Optional)</label>
              <input
                value={cashReceived}
                onChange={e => setCashReceived(e.target.value)}
                className={inputClass}
                placeholder="₹0"
                type="number"
              />
              {cash > 0 && (
                <div className={`flex justify-between text-sm px-1 pt-1 ${insufficientCash ? "text-destructive" : "text-success"}`}>
                  <span className="font-medium">{insufficientCash ? "Insufficient" : "Change Due"}</span>
                  <span className="font-bold font-mono">{insufficientCash ? `-₹${(subtotal - cash).toLocaleString()}` : `₹${change.toLocaleString()}`}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 pt-0 flex gap-3">
              <button
                onClick={handleMarkPaid}
                disabled={insufficientCash}
                className="flex-1 h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                Mark as Paid
              </button>
              <button
                onClick={handleSaveTab}
                className="flex-1 h-12 border-2 border-primary text-foreground font-bold rounded-xl hover:bg-primary/5 transition-colors active:scale-[0.98]"
              >
                Save as Tab
              </button>
            </div>
          </section>
        )}
      </div>

      <AddProductModal open={showAddProduct} onClose={() => setShowAddProduct(false)} onSave={handleAddProduct} />
      {lastTransaction && <ReceiptModal open={showReceipt} onClose={() => setShowReceipt(false)} transaction={lastTransaction} />}
    </div>
  );
}
