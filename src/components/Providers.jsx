"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { DeliveryLocationProvider } from "@/context/DeliveryLocationContext";
import { ToastProvider } from "@/components/ui/Toast";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        <WishlistProvider>
          <DeliveryLocationProvider>
            <ToastProvider>{children}</ToastProvider>
          </DeliveryLocationProvider>
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}