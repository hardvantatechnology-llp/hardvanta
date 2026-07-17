"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, X, ShoppingCart, Plus, GitCompare } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { imageSrc } from "@/utils/imageSrc";

const MAX = 4;

export default function ComparePage() {
  const { addItem } = useCart();
  const [all, setAll] = useState([]);
  const [selected, setSelected] = useState([]);
  const [picker, setPicker] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setAll(d.products || []))
      .catch(() => {});
  }, []);

  function addToCompare(id) {
    if (!id || selected.find((p) => p.id === id) || selected.length >= MAX) return;
    const prod = all.find((p) => p.id === id);
    if (prod) setSelected((s) => [...s, prod]);
    setPicker("");
  }
  function remove(id) {
    setSelected((s) => s.filter((p) => p.id !== id));
  }

  async function handleAddToCart(p) {
    try {
      await addItem(p);
    } catch (e) {
      console.error("add to cart failed", e);
    }
  }

  const available = all.filter((p) => !selected.find((s) => s.id === p.id));

  // Rows of the comparison table.
  const rows = [
    { label: "Price", render: (p) => <span className="font-bold text-white">{formatPrice(p.salePrice ?? p.price)}</span> },
    { label: "M.R.P.", render: (p) => (p.salePrice ? <span className="text-white/40 line-through">{formatPrice(p.price)}</span> : "—") },
    { label: "Brand", render: (p) => p.brand?.name || "—" },
    { label: "Rating", render: (p) => (<span className="inline-flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" />{p.rating} ({p.reviewCount})</span>) },
    { label: "Category", render: (p) => p.category?.name || "—" },
    { label: "Availability", render: (p) => (p.inStock !== false ? <span className="font-semibold text-cyan">In stock</span> : <span className="font-semibold text-red-400">Out of stock</span>) },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/3 top-[-15%] h-96 w-96 bg-electric/10" />
      <div className="container-page relative py-8">
      <div className="mb-2 flex items-center gap-2">
        <GitCompare className="text-electric-light" />
        <h1 className="text-2xl font-bold text-white">Compare Products</h1>
      </div>
      <p className="mb-6 text-sm text-white/50">
        Add up to {MAX} products side by side to compare specs and prices.
      </p>

      {/* Product picker */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <select
          value={picker}
          onChange={(e) => addToCompare(e.target.value)}
          disabled={selected.length >= MAX}
          aria-label="Add a product to compare"
          className="w-full max-w-sm rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric disabled:opacity-50"
        >
          <option value="" className="bg-graphite text-white">
            {selected.length >= MAX ? `Maximum ${MAX} products` : "+ Add a product to compare…"}
          </option>
          {available.map((p) => (
            <option key={p.id} value={p.id} className="bg-graphite text-white">{p.name}</option>
          ))}
        </select>
        <span className="text-sm text-white/40">{selected.length}/{MAX} selected</span>
      </div>

      {selected.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 py-20 text-center">
          <GitCompare size={48} className="text-white/25" />
          <p className="mt-4 font-semibold text-white">No products to compare yet</p>
          <p className="mt-1 text-sm text-white/40">
            Use the dropdown above to add products.
          </p>
          <Link href="/products" className="mt-6 rounded-lg bg-gradient-to-r from-electric to-liquid px-6 py-3 text-sm font-semibold text-white shadow-glow-electric hover:brightness-110 transition-all">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl glass-card">
          <table className="w-full min-w-[600px] border-collapse">
            <caption className="sr-only">Product comparison table</caption>
            <thead>
              <tr>
                <th scope="col" className="w-32 border-b border-white/10" />
                {selected.map((p) => (
                  <th key={p.id} scope="col" className="border-b border-white/10 p-4 align-top">
                    <div className="relative">
                      <button
                        onClick={() => remove(p.id)}
                        className="absolute -right-1 -top-1 rounded-full glass p-1 text-white/50 hover:text-red-400"
                        aria-label={`Remove ${p.name} from comparison`}
                      >
                        <X size={14} />
                      </button>
                      <Link href={`/products/${p.slug || p.id}`}>
                        <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-lg bg-white/5">
                          <Image src={imageSrc(p.image)} alt={p.name} fill sizes="112px" className="object-cover" />
                        </div>
                        <p className="mt-2 line-clamp-2 text-center text-sm font-semibold text-white/90 hover:text-electric-light">
                          {p.name}
                        </p>
                      </Link>
                    </div>
                  </th>
                ))}
                {selected.length < MAX && (
                  <th scope="col" className="border-b border-white/10 p-4 text-center align-middle text-white/30">
                    <Plus size={24} className="mx-auto" />
                    <span className="mt-1 block text-xs">Add more above</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="even:bg-white/[0.03]">
                  <th scope="row" className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-white/40">{row.label}</th>
                  {selected.map((p) => (
                    <td key={p.id} className="p-3 text-center text-sm text-white/80">{row.render(p)}</td>
                  ))}
                  {selected.length < MAX && <td />}
                </tr>
              ))}
              <tr>
                <td className="p-3" />
                {selected.map((p) => (
                  <td key={p.id} className="p-3 text-center">
                    <button
                      onClick={() => handleAddToCart(p)}
                      disabled={p.inStock === false}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-electric to-liquid px-4 py-2 text-sm font-semibold text-white shadow-glow-electric hover:brightness-110 transition-all disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <ShoppingCart size={16} /> Add
                    </button>
                  </td>
                ))}
                {selected.length < MAX && <td />}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}
