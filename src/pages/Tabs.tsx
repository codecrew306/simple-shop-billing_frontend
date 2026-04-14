import { useState } from "react";
import { useApp, type Tab } from "@/context/AppContext";
import { toast } from "sonner";
import { X, CheckCircle, Eye, CreditCard, Phone, Calendar, ShoppingBag, User } from "lucide-react";

export default function TabsPage() {
  const { tabs, settleTab, updateTabPayment, addTransaction } = useApp();
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
  const [paymentTab, setPaymentTab] = useState<Tab | null>(null);
  const [amountReceived, setAmountReceived] = useState("");

  const handleSettle = () => {
    if (!paymentTab) return;
    const amt = parseFloat(amountReceived) || 0;
    const outstanding = paymentTab.total - paymentTab.paid;
    if (amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (amt > outstanding) { toast.error("Amount exceeds outstanding balance"); return; }

    if (amt >= outstanding) {
      addTransaction({
        id: `t-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        customer: paymentTab.customer,
        phone: paymentTab.phone,
        items: paymentTab.items,
        total: paymentTab.total,
        payment: "Cash",
      });
      settleTab(paymentTab.id);
      toast.success("Tab fully settled!");
    } else {
      updateTabPayment(paymentTab.id, amt);
      toast.success(`₹${amt.toLocaleString()} received. Outstanding: ₹${(outstanding - amt).toLocaleString()}`);
    }
    setPaymentTab(null);
    setAmountReceived("");
  };

  const inputClass = "w-full h-12 px-3 border border-input rounded-lg text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background";

  if (tabs.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <CheckCircle size={48} className="text-success mb-3" />
        <p className="text-lg font-semibold text-foreground">No unpaid tabs</p>
        <p className="text-sm text-muted-foreground">All customers have paid!</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 max-w-2xl mx-auto">
      {tabs.map(tab => {
        const outstanding = tab.total - tab.paid;
        const paidPercent = Math.round((tab.paid / tab.total) * 100);

        return (
          <div key={tab.id} className="bg-card rounded-2xl overflow-hidden card-shadow hover:shadow-md transition-shadow">
            {/* Top: customer info + outstanding badge */}
            <div className="p-4 pb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold text-sm shrink-0">
                  {tab.customer.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground truncate">{tab.customer}</p>
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-destructive/10 text-destructive">
                      ₹{outstanding.toLocaleString()} due
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {tab.phone && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone size={11} />
                        {tab.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar size={11} />
                      {tab.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">
                    Paid: <span className="font-mono font-semibold text-success">₹{tab.paid.toLocaleString()}</span>
                    <span className="text-muted-foreground/60"> / ₹{tab.total.toLocaleString()}</span>
                  </span>
                  <span className="font-mono text-muted-foreground">{paidPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all duration-500"
                    style={{ width: `${paidPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom row: meta + actions */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-t border-border">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ShoppingBag size={11} />
                {tab.items.length} item{tab.items.length > 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTab(tab)}
                  className="h-8 px-3 rounded-full flex items-center gap-1 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  <Eye size={13} />
                  Details
                </button>
                <button
                  onClick={() => { setPaymentTab(tab); setAmountReceived(""); }}
                  className="h-8 px-3 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1"
                >
                  <CreditCard size={13} />
                  Pay
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Tab Detail Modal */}
      {selectedTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTab(null)}>
          <div className="absolute inset-0 bg-foreground/50" />
          <div className="relative bg-background rounded-2xl w-full max-w-md p-6 card-shadow animate-fade-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedTab(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={20} /></button>
            <h3 className="text-lg font-semibold text-foreground mb-4">Tab Details</h3>
            <div className="space-y-1 text-sm mb-4">
              <p><span className="text-muted-foreground">Customer:</span> <span className="text-foreground">{selectedTab.customer}</span></p>
              <p><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{selectedTab.phone}</span></p>
              <p><span className="text-muted-foreground">Bill Date:</span> <span className="text-foreground">{selectedTab.date}</span></p>
            </div>
            <div className="border-t border-border pt-3 mb-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Items</p>
              {selectedTab.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1">
                  <span className="text-foreground">{item.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                  <span className="font-mono text-foreground">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono text-foreground">₹{selectedTab.total}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount Paid</span><span className="font-mono text-success">₹{selectedTab.paid}</span></div>
              <div className="flex justify-between font-bold"><span className="text-destructive">Outstanding</span><span className="font-mono text-destructive">₹{selectedTab.total - selectedTab.paid}</span></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setPaymentTab(selectedTab); setSelectedTab(null); setAmountReceived(""); }} className="flex-1 h-11 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:brightness-110 transition-all">Record Payment</button>
              <button onClick={() => setSelectedTab(null)} className="flex-1 h-11 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setPaymentTab(null)}>
          <div className="absolute inset-0 bg-foreground/50" />
          <div className="relative bg-background rounded-2xl w-full max-w-md p-6 card-shadow animate-fade-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPaymentTab(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={20} /></button>
            <h3 className="text-lg font-semibold text-foreground mb-4">Settle Outstanding Amount</h3>
            <div className="space-y-1 text-sm mb-4">
              <p><span className="text-muted-foreground">Customer:</span> <span className="text-foreground">{paymentTab.customer}</span></p>
              <p><span className="text-muted-foreground">Outstanding:</span> <span className="font-mono font-bold text-destructive">₹{(paymentTab.total - paymentTab.paid).toLocaleString()}</span></p>
            </div>
            <div className="mb-3">
              <label className="text-sm font-medium text-foreground block mb-1.5">Amount Received</label>
              <input value={amountReceived} onChange={e => setAmountReceived(e.target.value)} className={inputClass} type="number" placeholder="₹0" />
            </div>
            {parseFloat(amountReceived) > 0 && parseFloat(amountReceived) < (paymentTab.total - paymentTab.paid) && (
              <p className="text-xs text-muted-foreground font-mono mb-3">Remaining after payment: ₹{((paymentTab.total - paymentTab.paid) - parseFloat(amountReceived)).toLocaleString()}</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setPaymentTab(null)} className="flex-1 h-11 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSettle} className="flex-1 h-11 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:brightness-110 transition-all">Confirm Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
