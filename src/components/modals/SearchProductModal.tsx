import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export default function SearchProductModal({
  open,
  onClose,
  products,
  onAddToCart,
  onEditProduct,
  onDeleteProduct,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.barcode.includes(query)
  );

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    toast.success(`Added: ${product.name}`);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col gap-0 p-0">
        <DialogHeader className="p-4 pb-3 border-b border-border">
          <DialogTitle className="text-base font-semibold">Search Products</DialogTitle>
          <div className="relative mt-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or barcode..."
              className="pl-9 h-10"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-[200px] max-h-[50vh]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Search size={32} className="mb-2 opacity-30" />
              <p className="text-sm font-medium">No products found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          ) : (
            filtered.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {product.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    ₹{product.price} · {product.barcode}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditProduct(product)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => handleAdd(product)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:brightness-110 transition-all"
                    title="Add to cart"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
