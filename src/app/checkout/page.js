"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Ticket, X, Tag, Truck, Wifi, Banknote } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import { lookupPincode } from "@/utils/pincode";
import Button from "@/components/ui/Button";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";

const COD_LIMIT = 10000;

export default function CheckoutPage() {
  const router = useRouter();
  const { status } = useSession();
  const {
  items,
  total,
  count,
  coupon,
  setCoupon,
} = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    flatHouse: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [payMethod, setPayMethod] = useState("COD");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pinStatus, setPinStatus] = useState("idle");
  const [pinMessage, setPinMessage] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  // Price calculations
  const mrpTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const productDiscount = items.reduce((sum, item) => {
    if (item.salePrice != null) return sum + (item.price - item.salePrice) * item.quantity;
    return sum;
  }, 0);
  const subtotal = total;
  const couponDiscount = coupon?.discountAmount ?? 0;
  const shipping = (subtotal - couponDiscount) >= 999 ? 0 : 49;
  const grandTotal = subtotal - couponDiscount + shipping;
  const totalSaved = productDiscount + couponDiscount;
  const codBlocked = grandTotal > COD_LIMIT;

  useEffect(() => {
    if (codBlocked && payMethod === "COD") setPayMethod("ONLINE");
  }, [codBlocked, payMethod]);

  // Coupon functions
  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponError(data.message || "Invalid coupon.");
        setCoupon(null);
      } else {
        setCoupon(data);
        setCouponCode("");
      }
    } catch {
      setCouponError("Something went wrong. Try again.");
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
  }

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handlePincode(value) {
    const pin = value.replace(/\D/g, "").slice(0, 6);
    update("pincode", pin);
    if (pin.length < 6) { setPinStatus("idle"); setPinMessage(""); return; }
    setPinStatus("checking");
    setPinMessage("Checking PIN code…");
    const result = await lookupPincode(pin);
    if (result.ok) {
      setForm((f) => ({ ...f, pincode: pin, city: result.city, state: result.state }));
      setPinStatus("ok");
      setPinMessage(`${result.area}, ${result.city}, ${result.state}`);
    } else {
      setPinStatus("error");
      setPinMessage(result.error);
    }
  }

  function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  function buildAddressPayload() {
    const parts = [form.flatHouse.trim(), form.area.trim()];
    if (form.landmark.trim()) parts.push(`Near ${form.landmark.trim()}`);
    const line1 = parts.filter(Boolean).join(", ");
    return {
      fullName: form.fullName, phone: form.phone, line1,
      flatHouse: form.flatHouse, area: form.area, landmark: form.landmark,
      city: form.city, state: form.state, pincode: form.pincode,
    };
  }

  async function handleCOD() {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: buildAddressPayload(),
        couponCode: coupon?.code ?? null,
        couponDiscount,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not place order.");
    setCoupon(null);
    router.push("/orders?placed=1");
    router.refresh();
  }

  async function handleOnlinePayment() {
    const ok = await loadRazorpayScript();
    if (!ok) throw new Error("Could not load payment gateway. Check your connection.");
    const res = await fetch("/api/payment/create-order", { method: "POST" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not start payment.");
    const address = buildAddressPayload();
    await new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: data.keyId, amount: data.amount, currency: data.currency,
        name: "hardvanta", description: "Order payment", order_id: data.orderId,
        prefill: { name: form.fullName, contact: form.phone },
        theme: { color: "#2545d3" },
        handler: async (response) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response, address,
              couponCode: coupon?.code ?? null,
              couponDiscount,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) { reject(new Error(verifyData.error || "Payment verification failed.")); return; }
          router.push("/orders?placed=1");
          router.refresh();
          resolve();
        },
        modal: { ondismiss: () => reject(new Error("Payment cancelled.")) },
      });
      rzp.on("payment.failed", (resp) => reject(new Error(resp.error?.description || "Payment failed.")));
      rzp.open();
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Please enter a valid Indian mobile number (must start with 6, 7, 8 or 9).");
      return;
    }
    if (pinStatus === "error") {
      setError("Please enter a valid Indian PIN code before placing the order.");
      return;
    }
    if (payMethod === "COD" && codBlocked) {
      setError(`Cash on Delivery is available only for orders up to ${formatPrice(COD_LIMIT)}. Please pay online.`);
      return;
    }
    setLoading(true);
    try {
      if (payMethod === "ONLINE") await handleOnlinePayment();
      else await handleCOD();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (status === "loading") {
    return <div className="container-page min-h-screen py-24 text-center text-white/50 bg-gradient-to-b from-graphite to-obsidian">Loading…</div>;
  }

  if (count === 0) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-graphite to-obsidian container-page flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-2xl font-bold text-white">Your cart is empty</h1>
        <Button href="/products" variant="gradient" className="mt-6">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/3 top-[-15%] h-96 w-96 bg-liquid/10" />
      <div className="container-page relative py-8">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">Checkout</h1>
        <CheckoutStepper step={2} />
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Address + Payment form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 glass-strong rounded-3xl p-6 lg:col-span-2"
          >
            <h2 className="text-lg font-bold text-white">Shipping Address</h2>
            {error && (
              <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">{error}</p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={form.fullName} onChange={(v) => update("fullName", v)} required />
              <Field
                label="Phone" value={form.phone} type="tel" inputMode="numeric"
                placeholder="10-digit mobile number" minLength={10} maxLength={10}
                onChange={(v) => update("phone", v.replace(/\D/g, "").slice(0, 10))} required
              />
            </div>

            <Field
              label="Flat / House No / Building Name" value={form.flatHouse}
              onChange={(v) => update("flatHouse", v)} required
              placeholder="e.g. Flat 302, Shree Residency"
            />
            <Field
              label="Area / Sector / Locality" value={form.area}
              onChange={(v) => update("area", v)} required
              placeholder="e.g. Sector 62, Near City Mall"
            />
            <Field
              label="Landmark (optional)" value={form.landmark}
              onChange={(v) => update("landmark", v)}
              placeholder="e.g. Opposite HDFC Bank"
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="checkout-pincode" className="mb-1 block text-sm font-medium text-white/80">Pincode</label>
                <input
                  id="checkout-pincode"
                  type="text" inputMode="numeric" required value={form.pincode}
                  onChange={(e) => handlePincode(e.target.value)} placeholder="6-digit PIN"
                  className={`w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 ${
                    pinStatus === "error" ? "ring-1 ring-red-400"
                    : pinStatus === "ok" ? "ring-1 ring-cyan"
                    : "focus:shadow-glow-electric"
                  }`}
                />
                {pinMessage && (
                  <p className={`mt-1 text-xs ${pinStatus === "error" ? "text-red-400" : pinStatus === "ok" ? "text-cyan" : "text-white/40"}`}>
                    {pinStatus === "ok" ? "✓ " : pinStatus === "error" ? "✕ " : ""}{pinMessage}
                  </p>
                )}
              </div>
              <Field label="City" value={form.city} onChange={(v) => update("city", v)} required />
              <Field label="State" value={form.state} onChange={(v) => update("state", v)} required />
            </div>

            {/* Payment method */}
            <div className="pt-2">
              <h3 className="mb-2 text-sm font-semibold text-white/80">Payment Method</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <PayOption
                  active={payMethod === "ONLINE"} onClick={() => setPayMethod("ONLINE")}
                  title="Pay Online" desc="UPI, Cards, Netbanking" Icon={Wifi}
                />
                <PayOption
                  active={payMethod === "COD"} onClick={() => setPayMethod("COD")}
                  title="Cash on Delivery" desc="Pay when it arrives" Icon={Banknote}
                  disabled={codBlocked}
                />
              </div>
              {codBlocked && (
                <p className="mt-2 text-xs text-red-400">
                  Cash on Delivery is available only for orders up to {formatPrice(COD_LIMIT)}. Please pay online for this order.
                </p>
              )}
            </div>

            <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
              {loading ? "Processing…" : payMethod === "ONLINE" ? `Pay ${formatPrice(grandTotal)}` : `Place Order · ${formatPrice(grandTotal)}`}
            </Button>
            <p className="text-center text-xs text-white/40">
              {payMethod === "ONLINE" ? "Secured by Razorpay. Test mode — use a test card/UPI." : "No payment now — pay in cash on delivery."}
            </p>
          </form>

          {/* Order Summary */}
          <div className="sticky top-24 h-fit space-y-4">
            <div className="glass-strong rounded-3xl p-6">
              <h2 className="mb-4 text-lg font-bold text-white">Order Summary</h2>

              {/* Items list */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="mr-2 line-clamp-1 text-white/50">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="shrink-0 font-semibold text-white">
                      {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="my-4 border-t border-white/10" />

              {/* Price breakdown */}
              <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-white/50">Total MRP</span>
                  <span className="font-semibold text-white">{formatPrice(mrpTotal)}</span>
                </div>

                {productDiscount > 0 && (
                  <div className="flex justify-between text-cyan">
                    <span className="flex items-center gap-1.5"><Tag size={13} /> Discount on MRP</span>
                    <span className="font-semibold">-{formatPrice(productDiscount)}</span>
                  </div>
                )}

                {coupon && (
                  <div className="flex justify-between text-cyan">
                    <span className="flex items-center gap-1.5"><Ticket size={13} /> Coupon ({coupon.code})</span>
                    <span className="font-semibold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-white/50 flex items-center gap-1.5"><Truck size={13} /> Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-cyan" : "text-white"}`}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="my-4 border-t border-dashed border-white/10" />

              {/* Grand total */}
              <div className="flex justify-between text-base font-bold text-white">
                <span>Amount Payable</span>
                <div className="text-right">
                  <span className="text-xl">{formatPrice(grandTotal)}</span>
                  {totalSaved > 0 && (
                    <p className="text-xs text-cyan font-medium mt-0.5">🎉 You save {formatPrice(totalSaved)}</p>
                  )}
                </div>
              </div>

              {/* Coupon input */}
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-white/80">Have a coupon?</p>
                {coupon ? (
                  <div className="flex items-center justify-between rounded-xl border border-cyan/30 bg-cyan/10 px-3 py-2.5">
                    <div className="flex items-center gap-2 text-sm text-cyan font-semibold">
                      <Ticket size={15} />
                      {coupon.code} applied!
                    </div>
                    <button type="button" onClick={removeCoupon} className="text-cyan hover:text-red-400 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      placeholder="Enter coupon code"
                      className="flex-1 rounded-xl glass-card px-3 py-2 text-sm text-white outline-none focus:shadow-glow-electric uppercase placeholder:normal-case placeholder:text-white/30"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="rounded-xl bg-gradient-to-r from-electric to-liquid px-4 py-2 text-sm font-semibold text-white shadow-glow-electric hover:brightness-110 disabled:opacity-50 disabled:shadow-none transition-all"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="mt-1.5 text-xs text-red-400">{couponError}</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function PayOption({ active, onClick, title, desc, disabled, Icon }) {
  return (
    <button
      type="button" onClick={disabled ? undefined : onClick} disabled={disabled}
      className={`flex items-start gap-3 rounded-2xl p-3 text-left transition-all ${
        disabled ? "cursor-not-allowed glass-card opacity-40"
        : active ? "glass-card shadow-glow-electric ring-1 ring-electric/50" : "glass-card hover:shadow-glow-electric"
      }`}
    >
      {Icon && <Icon size={18} className={active ? "text-electric-light" : "text-white/40"} />}
      <span className="flex-1">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="block text-xs text-white/40">{desc}</span>
      </span>
      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${active ? "border-electric-light" : "border-white/20"}`}>
        {active && <span className="h-2 w-2 rounded-full bg-gradient-to-r from-electric to-liquid" />}
      </span>
    </button>
  );
}

function Field({ label, value, onChange, required, type = "text", inputMode, placeholder, minLength, maxLength }) {
  const id = `checkout-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-white/80">
        {label}{required && <span className="ml-0.5 text-electric-light">*</span>}
      </label>
      <input
        id={id}
        type={type} inputMode={inputMode} required={required}
        minLength={minLength} maxLength={maxLength} value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:shadow-glow-electric"
      />
    </div>
  );
}
