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

  const available = all.filter((p) => !selected.find((s) => s.id === p.id));

  // Rows of the comparison table.
  const rows = [
    { label: "Price", render: (p) => <span className="font-bold text-navy">{formatPrice(p.salePrice ?? p.price)}</span> },
    { label: "M.R.P.", render: (p) => (p.salePrice ? <span className="text-silver-dark line-through">{formatPrice(p.price)}</span> : "—") },
    { label: "Brand", render: (p) => p.brand || "—" },
    { label: "Rating", render: (p) => (<span className="inline-flex items-center gap-1"><Star size={14} className="fill-yellow-400 text-yellow-400" />{p.rating} ({p.reviewCount})</span>) },
    { label: "Category", render: (p) => p.category || "—" },
    { label: "Availability", render: (p) => (p.stock > 0 ? <span className="font-semibold text-green-600">In stock</span> : <span className="font-semibold text-red-500">Out of stock</span>) },
  ];

  return (
    <div className="container-page py-8">
      <div className="mb-2 flex items-center gap-2">
        <GitCompare className="text-royal" />
        <h1 className="text-2xl font-bold text-navy">Compare Products</h1>
      </div>
      <p className="mb-6 text-sm text-silver-dark">
        Add up to {MAX} products side by side to compare specs and prices.
      </p>

      {/* Product picker */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <select
          value={picker}
          onChange={(e) => addToCompare(e.target.value)}
          disabled={selected.length >= MAX}
          className="w-full max-w-sm rounded-lg border border-silver-dark px-3 py-2.5 text-sm outline-none focus:border-royal disabled:opacity-50"
        >
          <option value="">
            {selected.length >= MAX ? `Maximum ${MAX} products` : "+ Add a product to compare…"}
          </option>
          {available.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <span className="text-sm text-silver-dark">{selected.length}/{MAX} selected</span>
      </div>

      {selected.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-silver-dark py-20 text-center">
          <GitCompare size={48} className="text-silver-dark" />
          <p className="mt-4 font-semibold text-navy">No products to compare yet</p>
          <p className="mt-1 text-sm text-silver-dark">
            Use the dropdown above to add products.
          </p>
          <Link href="/products" className="mt-6 rounded-lg bg-royal px-6 py-3 text-sm font-semibold text-white hover:bg-royal-dark">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="w-32 border-b border-silver-light" />
                {selected.map((p) => (
                  <th key={p.id} className="border-b border-silver-light p-4 align-top">
                    <div className="relative">
                      <button
                        onClick={() => remove(p.id)}
                        className="absolute -right-1 -top-1 rounded-full bg-white p-1 text-silver-dark shadow hover:text-red-500"
                        aria-label="Remove"
                      >
                        <X size={14} />
                      </button>
                      <Link href={`/products/${p.slug || p.id}`}>
                        <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-lg bg-cloud">
                          <Image src={imageSrc(p.image)} alt={p.name} fill sizes="112px" className="object-cover" />
                        </div>
                        <p className="mt-2 line-clamp-2 text-center text-sm font-semibold text-navy hover:text-royal">
                          {p.name}
                        </p>
                      </Link>
                    </div>
                  </th>
                ))}
                {selected.length < MAX && (
                  <th className="border-b border-silver-light p-4 text-center align-middle text-silver-dark">
                    <Plus size={24} className="mx-auto" />
                    <span className="mt-1 block text-xs">Add more above</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="even:bg-cloud">
                  <td className="p-3 text-xs font-semibold uppercase tracking-wide text-silver-dark">{row.label}</td>
                  {selected.map((p) => (
                    <td key={p.id} className="p-3 text-center text-sm text-navy">{row.render(p)}</td>
                  ))}
                  {selected.length < MAX && <td />}
                </tr>
              ))}
              <tr>
                <td className="p-3" />
                {selected.map((p) => (
                  <td key={p.id} className="p-3 text-center">
                    <button
                      onClick={() => addItem(p)}
                      disabled={p.stock <= 0}
                      className="inline-flex items-center gap-2 rounded-lg bg-royal px-4 py-2 text-sm font-semibold text-white hover:bg-royal-dark disabled:opacity-50"
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
  );
}
