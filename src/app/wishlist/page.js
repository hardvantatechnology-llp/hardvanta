"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) { setLoading(false); return; }
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => { setWishlist(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session, status]);

  const handleRemove = async (productId) => {
    setWishlist((prev) => prev.filter((i) => i.productId !== productId));
    await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
  };

  if (status !== "loading" && !session) {
    return (
      <div style={{ textAlign: "center", padding: "80px 16px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>🔒 Login karo Wishlist dekhne ke liye</h2>
        <Link href="/login">
          <button style={{ background: "#2874f0", color: "#fff", border: "none", borderRadius: 4, padding: "12px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            LOGIN KARO
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "sans-serif", background: "#f1f3f6", minHeight: "100vh", padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>My Wishlist ({wishlist.length} items)</h1>

      {loading && <p>Loading...</p>}

      {!loading && wishlist.length === 0 && (
        <div style={{ background: "#fff", borderRadius: 4, padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🤍</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Wishlist khaali hai!</h2>
          <p style={{ color: "#878787", marginBottom: 20 }}>Products pe ❤️ dabao — yahan save ho jayenge</p>
          <Link href="/products">
            <button style={{ background: "#2874f0", color: "#fff", border: "none", borderRadius: 4, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              PRODUCTS DEKHO
            </button>
          </Link>
        </div>
      )}

      {!loading && wishlist.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {wishlist.map((item) => (
            <div key={item.id} style={{ background: "#fff", borderRadius: 4, padding: 16, border: "1px solid #e0e0e0" }}>
              {item.product?.image && (
                <div style={{ position: "relative", width: "100%", height: 140, marginBottom: 8 }}>
                  <Image
                    src={item.product.image}
                    alt={item.product?.name || "Wishlist product"}
                    fill
                    sizes="(max-width: 768px) 100vw, 200px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              )}
              <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{item.product?.name}</p>
              <p style={{ fontWeight: 700, fontSize: 16, color: "#212121", marginBottom: 12 }}>
                ₹{item.product?.salePrice ?? item.product?.price}
              </p>
              <Link href={`/products/${item.product?.slug}`} style={{ textDecoration: "none" }}>
                <button style={{ width: "100%", padding: "8px 0", background: "#2874f0", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>
                  VIEW PRODUCT
                </button>
              </Link>
              <button onClick={() => handleRemove(item.productId)}
                style={{ width: "100%", padding: "8px 0", background: "#fff", color: "#f44336", border: "1px solid #f44336", borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                REMOVE
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}