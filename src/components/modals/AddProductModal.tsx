import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (product: { name: string; price: number; barcode: string }) => void;
}

export default function AddProductModal({ open, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Grocery");
  const barcode = "8901234567890";

  if (!open) return null;

  const handleSave = () => {
    if (!name || !price) { toast.error("Please fill required fields"); return; }
    onSave({ name, price: parseFloat(price), barcode });
    setName("");
    setPrice("");
  };

  const inputClass = "w-full h-12 px-3 border border-input rounded-lg text-base focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/50" />
      <div className="relative bg-background rounded-2xl w-full max-w-md p-6 card-shadow animate-fade-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"><X size={20} /></button>

        <h3 className="text-lg font-semibold text-foreground mb-4">Add New Product</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Barcode (scanned)</label>
            <input value={barcode} readOnly className={`${inputClass} bg-muted text-muted-foreground`} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Product Name*</label>
            <input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="e.g. Milk 2L" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Price* (₹)</label>
            <input value={price} onChange={e => setPrice(e.target.value)} type="number" className={inputClass} placeholder="0" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Category (Optional)</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
              <option>Grocery</option>
              <option>Dairy</option>
              <option>Beverages</option>
              <option>Snacks</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-11 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex-1 h-11 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:brightness-110 transition-all">Save Product</button>
        </div>
      </div>
    </div>
  );
}
