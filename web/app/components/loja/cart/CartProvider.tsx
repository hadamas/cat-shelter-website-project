"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

// Sacola de compras. Fica salva no navegador (localStorage): se a pessoa fechar
// o site e voltar, os itens continuam lá.

export type CartItem = {
  /** produto + cor + tamanho: a mesma caneca em duas cores são dois itens */
  key: string;
  productId: string;
  slug: string;
  name: string;
  photo?: string;
  /** preço pago por unidade, em centavos (já com promoção) */
  unitPrice: number;
  /** preço sem promoção, em centavos */
  originalPrice: number;
  color?: string;
  size?: string;
  quantity: number;
  /** estoque no momento em que foi adicionado (limita a quantidade) */
  stock: number;
  limitedEdition: boolean;
};

type CartState = {
  items: CartItem[];
  /** total de unidades (número no ícone da sacola) */
  count: number;
  /** valor total em centavos */
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** adiciona e devolve a quantidade que realmente coube (respeita o estoque) */
  add: (item: Omit<CartItem, "key" | "quantity">, quantity?: number) => number;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "gdf-sacola-v1";
const CartContext = createContext<CartState | null>(null);

export const cartKey = (productId: string, color?: string, size?: string) =>
  [productId, color ?? "", size ?? ""].join("|");

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.key && i.quantity > 0) : [];
  } catch {
    return [];
  }
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  // carrega depois de montar (no servidor não existe localStorage)
  useEffect(() => {
    setItems(load()); // eslint-disable-line react-hooks/set-state-in-effect -- leitura única do navegador
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // modo anônimo ou armazenamento cheio: a sacola funciona só nesta visita
    }
  }, [items, loaded]);

  // cópia sempre atualizada dos itens, para calcular quanto cabe no estoque na hora
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const add = useCallback<CartState["add"]>((item, quantity = 1) => {
    const key = cartKey(item.productId, item.color, item.size);
    const current = itemsRef.current;
    const existing = current.find((i) => i.key === key);
    const inCart = existing?.quantity ?? 0;
    const added = Math.max(0, Math.min(quantity, item.stock - inCart));
    if (added === 0) return 0;
    const next = existing
      ? current.map((i) => (i.key === key ? { ...i, ...item, key, quantity: inCart + added } : i))
      : [...current, { ...item, key, quantity: added }];
    itemsRef.current = next;
    setItems(next);
    return added;
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) =>
      current.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i)),
    );
  }, []);

  const remove = useCallback((key: string) => setItems((current) => current.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartState>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    return { items, count, total, open, setOpen, add, setQuantity, remove, clear };
  }, [items, open, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const noopSubscribe = () => () => {};

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  // Enquanto a página "hidrata", mostra a sacola vazia, igual ao HTML que veio do
  // servidor (que não conhece o localStorage). Logo em seguida mostra os itens.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return hydrated ? ctx : { ...ctx, items: [], count: 0, total: 0 };
}
