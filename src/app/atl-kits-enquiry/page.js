"use client";

import { useState } from "react";
import Link from "next/link";
import { CircuitBoard, Phone, Mail, MapPin, CheckCircle2, FileText, Truck, Clock, BadgeCheck, Send } from "lucide-react";

const ATL_KITS = [
  { id: "electronics", label: "Basic Electronics Kit", price: "Rs.4,500 - Rs.6,000 / unit" },
  { id: "robotics", label: "Robotics Starter Kit", price: "Rs.8,000 - Rs.12,000 / unit" },
  { id: "arduino", label: "Arduino / Microcontroller Kit", price: "Rs.5,500 - Rs.7,500 / unit" },
  { id: "iot", label: "IoT & Sensors Kit", price: "Rs.7,000 - Rs.10,000 / unit" },
  { id: "3dprint", label: "3D Printing Filaments", price: "Rs.1,200 - Rs.2,500 / roll" },
  { id: "custom", label: "Custom / Mixed Bundle", price: "Pricing on request" },
];

const STATES = ["Uttar Pradesh","Delhi","Maharashtra","Rajasthan","Gujarat","Karnataka","Tamil Nadu","West Bengal","Madhya Pradesh","Other"];
const BUDGET_RANGES = ["Under Rs.1 Lakh","Rs.1 - Rs.3 Lakh","Rs.3 - Rs.5 Lakh","Rs.5 - Rs.10 Lakh","Above Rs.10 Lakh"];

// Valid Indian mobile numbers: exactly 10 digits, starting with 6-9
const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

export default function ATLKitsEnquiryPage() {
  const [selectedKits, setSelectedKits] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [form, setForm] = useState({ schoolName:"", contactPerson:"", designation:"", phone:"", email:"", state:"", quantity:"", budgetRange:"", udise:"", message:"" });

  function toggleKit(id) { setSelectedKits((prev) => prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]); }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "phone") {
      // Strip anything that isn't a digit, cap at 10 digits
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm((f) => ({ ...f, phone: digitsOnly }));

      if (digitsOnly.length === 0) {
        setPhoneError("");
      } else if (digitsOnly.length < 10) {
        setPhoneError("Phone number must be 10 digits");
      } else if (!INDIAN_PHONE_REGEX.test(digitsOnly)) {
        setPhoneError("Enter a valid Indian mobile number (must start with 6-9)");
      } else {
        setPhoneError("");
      }
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!INDIAN_PHONE_REGEX.test(form.phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-graphite to-obsidian px-4 py-16">
        <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-electric/10" />
        <div className="relative rounded-2xl glass-card p-10 max-w-md w-full text-center">
          <div className="flex justify-center mb-4"><CheckCircle2 size={56} className="text-electric-light" /></div>
          <h2 className="text-2xl font-semibold text-white mb-3">Enquiry Submitted!</h2>
          <p className="text-white/60 mb-6">Thank you. Our ATL team will contact you within 48 hours.</p>
          <Link href="/" className="inline-block rounded-lg bg-gradient-to-r from-electric to-liquid px-6 py-3 text-sm font-semibold text-white shadow-glow-electric hover:brightness-110 transition-all">Back to Home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-graphite to-obsidian">
      <div className="liquid-blob left-1/4 top-[-15%] h-96 w-96 bg-electric/10" />

      <section className="relative bg-gradient-to-r from-obsidian via-midnight to-obsidian text-white">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-5">
            <CircuitBoard size={14} /> Atal Tinkering Lab
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4 max-w-xl">ATL Kits Enquiry</h1>
          <p className="text-white/70 max-w-lg text-base leading-relaxed mb-10">Government-approved STEM kits for Atal Tinkering Labs. Get customised bulk quotes for your school or institution directly from Hardvanta Technologies.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl">
            {[{ num: "500+", label: "Schools served" },{ num: "48 hr", label: "Quote turnaround" },{ num: "Rs.0", label: "Consultation fee" }].map(({ num, label }) => (
              <div key={label} className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-center">
                <p className="text-2xl font-semibold">{num}</p>
                <p className="text-xs text-white/60 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[{ n:1, title:"Fill the form", desc:"Select kits & share your requirements" },{ n:2, title:"Get a quote", desc:"Our team responds within 48 hours" },{ n:3, title:"Confirm order", desc:"GST invoice & delivery to your school" }].map(({ n, title, desc }) => (
            <div key={n} className="rounded-xl glass-card p-4 flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-electric to-liquid text-white flex items-center justify-center text-sm font-semibold">{n}</span>
              <div><p className="text-sm font-semibold text-white">{title}</p><p className="text-xs text-white/60 mt-0.5">{desc}</p></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <form onSubmit={handleSubmit} className="rounded-2xl glass-card p-7">
            <h2 className="text-lg font-semibold text-white mb-1">Submit Enquiry</h2>
            <p className="text-sm text-white/60 mb-6">All fields marked <span className="text-electric-light font-bold">*</span> are required.</p>

            <p className="text-xs font-semibold uppercase tracking-widest text-electric-light mb-3">School / Institution Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="atl-school-name" className="text-xs font-medium text-white/60">School name <span className="text-electric-light">*</span></label>
                <input id="atl-school-name" name="schoolName" value={form.schoolName} onChange={handleChange} required type="text" placeholder="e.g. Kendriya Vidyalaya No. 1" className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="atl-contact-person" className="text-xs font-medium text-white/60">Contact person <span className="text-electric-light">*</span></label>
                <input id="atl-contact-person" name="contactPerson" value={form.contactPerson} onChange={handleChange} required type="text" placeholder="Your full name" className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="atl-designation" className="text-xs font-medium text-white/60">Designation</label>
                <input id="atl-designation" name="designation" value={form.designation} onChange={handleChange} type="text" placeholder="e.g. ATL Coordinator" className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="atl-phone" className="text-xs font-medium text-white/60">Phone number <span className="text-electric-light">*</span></label>
                <input
                  id="atl-phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  aria-invalid={phoneError ? "true" : "false"}
                  className={
                    "w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 " +
                    (phoneError
                      ? "shadow-[0_0_0_1px_rgba(248,113,113,0.6)]"
                      : "focus:shadow-glow-electric")
                  }
                />
                {phoneError && <span className="text-xs text-red-400 mt-0.5">{phoneError}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="atl-email" className="text-xs font-medium text-white/60">Email address <span className="text-electric-light">*</span></label>
                <input id="atl-email" name="email" value={form.email} onChange={handleChange} required type="email" placeholder="school@email.com" className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="atl-state" className="text-xs font-medium text-white/60">State <span className="text-electric-light">*</span></label>
                <select id="atl-state" name="state" value={form.state} onChange={handleChange} required className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric">
                  <option value="" className="bg-graphite text-white">Select state</option>
                  {STATES.map((s) => <option key={s} className="bg-graphite text-white">{s}</option>)}
                </select>
              </div>
            </div>

            <hr className="border-white/10 my-5" />
            <p className="text-xs font-semibold uppercase tracking-widest text-electric-light mb-2">Kit Selection</p>
            <p className="text-xs text-white/60 mb-3">Select one or more kits you are interested in</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {ATL_KITS.map(({ id, label, price }) => (
                <label key={id} className={"flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all " + (selectedKits.includes(id) ? "border-electric/40 bg-electric/10" : "border-white/10 hover:border-electric/30")}>
                  <input type="checkbox" checked={selectedKits.includes(id)} onChange={() => toggleKit(id)} className="mt-0.5 w-4 h-4 flex-shrink-0 accent-electric" />
                  <div><p className="text-sm font-medium text-white">{label}</p><p className="text-xs text-electric-light mt-0.5">{price}</p></div>
                </label>
              ))}
            </div>

            <hr className="border-white/10 my-5" />
            <p className="text-xs font-semibold uppercase tracking-widest text-electric-light mb-3">Order Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="atl-quantity" className="text-xs font-medium text-white/60">Quantity required <span className="text-electric-light">*</span></label>
                <input id="atl-quantity" name="quantity" value={form.quantity} onChange={handleChange} required type="number" min="1" placeholder="e.g. 20" className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="atl-budget-range" className="text-xs font-medium text-white/60">Budget range</label>
                <select id="atl-budget-range" name="budgetRange" value={form.budgetRange} onChange={handleChange} className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric">
                  <option value="" className="bg-graphite text-white">Select range</option>
                  {BUDGET_RANGES.map((b) => <option key={b} className="bg-graphite text-white">{b}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              <label htmlFor="atl-udise" className="text-xs font-medium text-white/60">ATL Lab UDISE code</label>
              <input id="atl-udise" name="udise" value={form.udise} onChange={handleChange} placeholder="12-digit UDISE code (if available)" className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30" />
            </div>
            <div className="flex flex-col gap-1.5 mb-6">
              <label htmlFor="atl-message" className="text-xs font-medium text-white/60">Additional requirements</label>
              <textarea id="atl-message" name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Mention any specific components, delivery timeline, demo request, etc." className="w-full rounded-lg glass-card px-3 py-2.5 text-sm text-white outline-none focus:shadow-glow-electric placeholder:text-white/30 resize-y" />
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-electric to-liquid px-6 py-3 text-sm font-semibold text-white shadow-glow-electric hover:brightness-110 transition-all text-base">
              <Send size={18} /> Submit Enquiry
            </button>
            <p className="text-center text-xs text-white/40 mt-3">By submitting, you agree to be contacted by the Hardvanta sales team.</p>
          </form>

          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl glass-card p-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4"><Phone size={16} className="text-electric-light" /> Contact us directly</h3>
              {[{ Icon:Phone, strong:"+91 91705 46395", sub:"Mon - Sat, 9 AM - 6 PM" },{ Icon:Mail, strong:"atl@hardvantatechnology@gmail.com", sub:"Enquiries responded within 48 hrs" },{ Icon:MapPin, strong:"Pan-Delhi-NCR shipping", sub:"Delivered with GST invoice" }].map(({ Icon, strong, sub }) => (
                <div key={strong} className="flex items-start gap-3 py-2.5 border-b border-white/10 last:border-none">
                  <Icon size={16} className="text-electric-light mt-0.5 flex-shrink-0" />
                  <div><p className="text-sm font-medium text-white">{strong}</p><p className="text-xs text-white/60 mt-0.5">{sub}</p></div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl glass-card p-5 text-white">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><BadgeCheck size={16} /> Why Hardvanta ATL Kits?</h3>
              {["AIM / NITI Aayog aligned curriculum","GST compliant billing for schools","Bulk discount on 10+ units","Free teacher training material","Warranty & replacement support","Demo available for institutions"].map((feat) => (
                <div key={feat} className="flex items-center gap-2 py-1.5 text-sm text-white/70">
                  <CheckCircle2 size={14} className="text-cyan flex-shrink-0" />{feat}
                </div>
              ))}
            </div>

            <div className="rounded-2xl glass-card p-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4"><FileText size={16} className="text-electric-light" /> Procurement process</h3>
              {[{ Icon:Clock, strong:"Quote in 48 hours", sub:"After form submission" },{ Icon:FileText, strong:"PO accepted", sub:"School / trust purchase orders" },{ Icon:Truck, strong:"Delivery 7 - 14 days", sub:"Pan-Delhi-NCR, tracked shipment" }].map(({ Icon, strong, sub }) => (
                <div key={strong} className="flex items-start gap-3 py-2.5 border-b border-white/10 last:border-none">
                  <Icon size={16} className="text-electric-light mt-0.5 flex-shrink-0" />
                  <div><p className="text-sm font-medium text-white">{strong}</p><p className="text-xs text-white/60 mt-0.5">{sub}</p></div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}