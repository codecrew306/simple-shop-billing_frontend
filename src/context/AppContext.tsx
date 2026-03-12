import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode: string;
}

export interface Transaction {
  id: string;
  time: string;
  date: string;
  customer: string;
  phone: string;
  items: CartItem[];
  total: number;
  payment: string;
}

export interface Tab {
  id: string;
  customer: string;
  phone: string;
  date: string;
  items: CartItem[];
  total: number;
  paid: number;
}

interface AppState {
  isLoggedIn: boolean;
  storeName: string;
  storeId: string;
  ownerName: string;
  cart: CartItem[];
  transactions: Transaction[];
  tabs: Tab[];
  login: () => void;
  logout: () => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  addTransaction: (t: Transaction) => void;
  addTab: (tab: Tab) => void;
  settleTab: (id: string) => void;
  updateTabPayment: (id: string, amount: number) => void;
  setStoreName: (n: string) => void;
  setOwnerName: (n: string) => void;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", time: "10:45 AM", date: "15 Mar 2024", customer: "Rajesh", phone: "98765 43210", items: [{ id: "p1", name: "Milk 2L", price: 60, quantity: 2, barcode: "890001" }, { id: "p3", name: "Rice 5kg", price: 630, quantity: 1, barcode: "890003" }], total: 850, payment: "Cash" },
  { id: "t2", time: "10:15 AM", date: "15 Mar 2024", customer: "Priya", phone: "98765 11111", items: [{ id: "p1", name: "Milk 2L", price: 60, quantity: 2, barcode: "890001" }, { id: "p2", name: "Bread", price: 40, quantity: 1, barcode: "890002" }, { id: "p4", name: "Eggs (6 pcs)", price: 60, quantity: 1, barcode: "890004" }], total: 220, payment: "Cash" },
  { id: "t3", time: "09:50 AM", date: "15 Mar 2024", customer: "Walk-in", phone: "", items: [{ id: "p3", name: "Rice 5kg", price: 630, quantity: 1, barcode: "890003" }, { id: "p5", name: "Sugar 1kg", price: 45, quantity: 2, barcode: "890005" }, { id: "p6", name: "Tea 250g", price: 180, quantity: 1, barcode: "890006" }, { id: "p7", name: "Oil 1L", price: 170, quantity: 1, barcode: "890007" }], total: 1250, payment: "Cash" },
  { id: "t4", time: "09:20 AM", date: "15 Mar 2024", customer: "Amit", phone: "98765 22222", items: [{ id: "p2", name: "Bread", price: 40, quantity: 2, barcode: "890002" }, { id: "p1", name: "Milk 2L", price: 60, quantity: 3, barcode: "890001" }, { id: "p8", name: "Biscuits", price: 30, quantity: 3, barcode: "890008" }], total: 450, payment: "Cash" },
];

const MOCK_TABS: Tab[] = [
  { id: "tab1", customer: "Rajesh Sharma", phone: "98765 43210", date: "15 Mar 2024", items: [{ id: "p1", name: "Milk 2L", price: 60, quantity: 2, barcode: "890001" }, { id: "p2", name: "Bread", price: 40, quantity: 1, barcode: "890002" }, { id: "p4", name: "Eggs (6 pcs)", price: 60, quantity: 1, barcode: "890004" }, { id: "p3", name: "Rice 5kg", price: 630, quantity: 1, barcode: "890003" }], total: 850, paid: 500 },
  { id: "tab2", customer: "Amit Patel", phone: "98765 12345", date: "14 Mar 2024", items: [{ id: "p3", name: "Rice 5kg", price: 630, quantity: 1, barcode: "890003" }, { id: "p7", name: "Oil 1L", price: 170, quantity: 2, barcode: "890007" }, { id: "p6", name: "Tea 250g", price: 180, quantity: 1, barcode: "890006" }, { id: "p8", name: "Biscuits", price: 30, quantity: 3, barcode: "890008" }], total: 1250, paid: 0 },
];

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storeName, setStoreName] = useState("City Grocery");
  const [ownerName, setOwnerName] = useState("Ramesh Kumar");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [tabs, setTabs] = useState<Tab[]>(MOCK_TABS);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  const addTransaction = (t: Transaction) => setTransactions(prev => [t, ...prev]);
  const addTab = (tab: Tab) => setTabs(prev => [tab, ...prev]);
  const settleTab = (id: string) => setTabs(prev => prev.filter(t => t.id !== id));
  const updateTabPayment = (id: string, amount: number) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, paid: t.paid + amount } : t));
  };

  return (
    <AppContext.Provider value={{ isLoggedIn, storeName, storeId: "SHOP-7X9K2M", ownerName, cart, transactions, tabs, login, logout, addToCart, updateCartQuantity, removeFromCart, clearCart, addTransaction, addTab, settleTab, updateTabPayment, setStoreName, setOwnerName }}>
      {children}
    </AppContext.Provider>
  );
};
