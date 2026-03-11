import { X } from "lucide-react";
import { toast } from "sonner";
import type { Transaction } from "@/context/AppContext";

interface Props {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
}

export default function ReceiptModal({ open, onClose, transaction }: Props) {
  if (!open) return null;

  const handleShare = () => {
    toast.success(`Receipt shared with ${transaction.customer}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/50" />
      <div className="relative bg-background rounded-2xl w-full max-w-sm p-6 card-shadow animate-fade-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={20} /></button>

        <div className="font-mono text-xs text-center space-y-0.5 text-foreground">
          <p className="font-bold text-sm">CITY GROCERY</p>
          <p className="text-muted-foreground">123 Main Street, Mumbai</p>
          <p className="text-muted-foreground">GST: 27ABCDE1234F1Z5</p>
          <p className="text-muted-foreground">Tel: +91 98765 43210</p>
          <div className="border-t border-dashed border-border my-2" />
          <p>Bill Date: {transaction.date}</p>
          <p>Time: {transaction.time}</p>
          <p>Bill No: INV-{Date.now().toString().slice(-6)}</p>
          {transaction.customer !== "Walk-in" && <p>Customer: {transaction.customer}</p>}
          <div className="border-t border-dashed border-border my-2" />
          {transaction.items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t border-dashed border-border my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{transaction.total}</span>
          </div>
          <p>Payment: Cash</p>
          <div className="border-t border-dashed border-border my-2" />
          <p className="text-muted-foreground">Thank you for shopping!</p>
          <p className="text-[9px] text-muted-foreground mt-2">Phone number is only used for billing and tabs. No promotional messages.</p>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 h-11 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Close</button>
          <button onClick={handleShare} className="flex-1 h-11 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:brightness-110 transition-all">Share Receipt</button>
        </div>
      </div>
    </div>
  );
}
