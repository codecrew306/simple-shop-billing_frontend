import { X } from "lucide-react";
import { toast } from "sonner";
import type { Transaction } from "@/context/AppContext";

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function TransactionDetailModal({ transaction, onClose }: Props) {
  if (!transaction) return null;

  const handleShare = () => {
    toast.success(`Receipt shared with ${transaction.customer}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/50" />
      <div className="relative bg-background rounded-2xl w-full max-w-md p-6 card-shadow animate-fade-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center">
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold text-foreground mb-4">Transaction Details</h3>

        <div className="space-y-1 text-sm mb-4">
          <p><span className="text-muted-foreground">Store:</span> <span className="text-foreground">City Grocery</span></p>
          <p><span className="text-muted-foreground">Date:</span> <span className="text-foreground">{transaction.date}, {transaction.time}</span></p>
          <p><span className="text-muted-foreground">Customer:</span> <span className="text-foreground">{transaction.customer} {transaction.phone && `(${transaction.phone.slice(0, 5)}****)`}</span></p>
        </div>

        <div className="border-t border-border pt-3 mb-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Items</p>
          {transaction.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span className="text-foreground">{item.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
              <span className="font-mono text-foreground">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono text-foreground">₹{transaction.total}</span></div>
          <div className="flex justify-between font-semibold"><span className="text-foreground">Total</span><span className="font-mono text-foreground">₹{transaction.total}</span></div>
          <p className="text-muted-foreground">Payment: {transaction.payment}</p>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 h-11 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Close</button>
          <button onClick={handleShare} className="flex-1 h-11 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:brightness-110 transition-all">Share Receipt</button>
        </div>
      </div>
    </div>
  );
}
