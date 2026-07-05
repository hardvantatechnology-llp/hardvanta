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

    if (!session) {
      setLoading(false);
      return;
    }

    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        setWishlist(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session, status]);

  const handleRemove = async (productId) => {
    setWishlist((prev) =>
      prev.filter((item) => item.productId !== productId)
    );

    await fetch("/api/wishlist", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
  };

  // ================= LOGIN REQUIRED =================

  if (status !== "loading" && !session) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f1f3f6",
          padding: 20,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 40,
            borderRadius: 8,
            textAlign: "center",
            maxWidth: 420,
            width: "100%",
            boxShadow: "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <div style={{ fontSize: 55 }}>🔒</div>

          <h2
            style={{
              marginTop: 20,
              marginBottom: 10,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Login Required
          </h2>

          <p
            style={{
              color: "#666",
              marginBottom: 30,
              lineHeight: 1.6,
            }}
          >
            Please sign in to access your wishlist and save your favorite
            products.
          </p>

          <Link href="/login">
            <button
              style={{
                background: "#2874f0",
                color: "#fff",
                border: "none",
                padding: "12px 35px",
                borderRadius: 5,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              LOGIN
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f1f3f6",
        minHeight: "100vh",
        padding: 25,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 20,
          color: "#212121",
        }}
      >
        My Wishlist ({wishlist.length} Items)
      </h1>

      {loading && (
        <div
          style={{
            textAlign: "center",
            marginTop: 60,
            fontSize: 18,
            color: "#666",
          }}
        >
          Loading your wishlist...
        </div>
      )}

      {!loading && wishlist.length === 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: "70px 30px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 65,
              marginBottom: 20,
            }}
          >
            🤍
          </div>

          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#212121",
              marginBottom: 12,
            }}
          >
            Your Wishlist is Empty
          </h2>

          <p
            style={{
              color: "#777",
              fontSize: 16,
              marginBottom: 30,
            }}
          >
            Save products you love by clicking the ❤️ icon.
            <br />
            They will appear here for easy access anytime.
          </p>

          <Link href="/products">
            <button
              style={{
                background: "#2874f0",
                color: "#fff",
                border: "none",
                padding: "12px 35px",
                borderRadius: 5,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              BROWSE PRODUCTS
            </button>
          </Link>
        </div>
      )}

      {!loading && wishlist.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {wishlist.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                borderRadius: 8,
                padding: 15,
                border: "1px solid #ddd",
                transition: ".3s",
              }}
            >
              {item.product?.image && (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 180,
                    marginBottom: 12,
                  }}
                >
                  <Image
                    src={item.product.image}
                    alt={item.product?.name || "Product"}
                    fill
                    sizes="220px"
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}

              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#212121",
                  marginBottom: 8,
                  minHeight: 40,
                }}
              >
                {item.product?.name}
              </h3>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#212121",
                  marginBottom: 18,
                }}
              >
                ₹{item.product?.salePrice ?? item.product?.price}
              </div>

              <Link
                href={`/products/${item.product?.slug}`}
                style={{
                  textDecoration: "none",
                }}
              >
                <button
                  style={{
                    width: "100%",
                    background: "#2874f0",
                    color: "#fff",
                    border: "none",
                    padding: "11px",
                    borderRadius: 5,
                    cursor: "pointer",
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  VIEW PRODUCT
                </button>
              </Link>

              <button
                onClick={() => handleRemove(item.productId)}
                style={{
                  width: "100%",
                  background: "#fff",
                  color: "#d32f2f",
                  border: "1px solid #d32f2f",
                  padding: "11px",
                  borderRadius: 5,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                REMOVE FROM WISHLIST
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}