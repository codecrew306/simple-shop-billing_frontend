import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import TransactionDetailModal from "@/components/modals/TransactionDetailModal";
import type { Transaction } from "@/context/AppContext";
import { Calendar, CreditCard, Eye, Share2, ChevronRight, ShoppingBag, Clock } from "lucide-react";

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
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
              filter === f
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {transactions.slice(0, showCount).map(tx => (
          <div
            key={tx.id}
            className="bg-card rounded-2xl overflow-hidden card-shadow hover:shadow-md transition-shadow"
          >
            {/* Top row: avatar + customer + amount */}
            <div className="p-4 pb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {tx.customer.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground truncate">{tx.customer}</p>
                    <span className="text-base font-bold font-mono text-foreground">₹{tx.total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar size={11} />
                      {tx.date}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={11} />
                      {tx.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row: meta + actions */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-t border-border">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ShoppingBag size={11} />
                  {tx.items.length} item{tx.items.length > 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CreditCard size={11} />
                  {tx.payment}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toast.success(`Receipt shared with ${tx.customer}`)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Share"
                >
                  <Share2 size={14} />
                </button>
                <button
                  onClick={() => setSelectedTx(tx)}
                  className="h-8 px-3 rounded-full flex items-center gap-1 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  <Eye size={13} />
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCount < transactions.length && (
        <button
          onClick={() => setShowCount(s => s + 10)}
          className="w-full h-10 border border-border rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          Load More
        </button>
      )}

      <TransactionDetailModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
}
