import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import TransactionDetailModal from "@/components/modals/TransactionDetailModal";
import type { Transaction } from "@/context/AppContext";

const FILTERS = ["Today", "This Week", "This Month", "Custom"];

export default function Transactions() {
  const { transactions } = useApp();
  const [filter, setFilter] = useState("Today");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [showCount, setShowCount] = useState(10);

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{f}</button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {transactions.slice(0, showCount).map(tx => (
          <div key={tx.id} className="bg-card rounded-xl p-4 card-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-foreground">{tx.customer}</p>
                <p className="text-xs text-muted-foreground">{tx.date}, {tx.time}</p>
              </div>
              <span className="text-sm font-bold font-mono text-foreground">₹{tx.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Items: {tx.items.length} · Payment: {tx.payment}</p>
              <div className="flex gap-2">
                <button onClick={() => setSelectedTx(tx)} className="text-xs text-primary font-medium hover:underline">View Details</button>
                <button onClick={() => toast.success(`Receipt shared with ${tx.customer}`)} className="text-xs text-muted-foreground font-medium hover:underline">Share</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCount < transactions.length && (
        <button onClick={() => setShowCount(s => s + 10)} className="w-full h-10 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">Load More</button>
      )}

      <TransactionDetailModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
}
