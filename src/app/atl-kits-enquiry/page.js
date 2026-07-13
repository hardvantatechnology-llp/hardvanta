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

export default function ATLKitsEnquiryPage() {
  const [selectedKits, setSelectedKits] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ schoolName:"", contactPerson:"", designation:"", phone:"", email:"", state:"", quantity:"", budgetRange:"", udise:"", message:"" });

  function toggleKit(id) { setSelectedKits((prev) => prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]); }
  function handleChange(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); }
  function handleSubmit(e) { e.preventDefault(); setSubmitted(true); }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="flex justify-center mb-4"><CheckCircle2 size={56} className="text-royal" /></div>
          <h2 className="text-2xl font-semibold text-navy mb-3">Enquiry Submitted!</h2>
          <p className="text-gray-500 mb-6">Thank you. Our ATL team will contact you within 48 hours.</p>
          <Link href="/" className="inline-block bg-royal text-white font-semibold px-6 py-3 rounded-lg hover:bg-navy transition-colors">Back to Home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-5">
            <CircuitBoard size={14} /> Atal Tinkering Lab
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4 max-w-xl">ATL Kits Enquiry</h1>
          <p className="text-white/80 max-w-lg text-base leading-relaxed mb-10">Government-approved STEM kits for Atal Tinkering Labs. Get customised bulk quotes for your school or institution directly from Hardvanta Technologies.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl">
            {[{ num: "500+", label: "Schools served" },{ num: "48 hr", label: "Quote turnaround" },{ num: "Rs.0", label: "Consultation fee" }].map(({ num, label }) => (
              <div key={label} className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-center">
                <p className="text-2xl font-semibold">{num}</p>
                <p className="text-xs text-white/70 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[{ n:1, title:"Fill the form", desc:"Select kits & share your requirements" },{ n:2, title:"Get a quote", desc:"Our team responds within 48 hours" },{ n:3, title:"Confirm order", desc:"GST invoice & delivery to your school" }].map(({ n, title, desc }) => (
            <div key={n} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-royal text-white flex items-center justify-center text-sm font-semibold">{n}</span>
              <div><p className="text-sm font-semibold text-navy">{title}</p><p className="text-xs text-gray-500 mt-0.5">{desc}</p></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-7">
            <h2 className="text-lg font-semibold text-navy mb-1">Submit Enquiry</h2>
            <p className="text-sm text-gray-500 mb-6">All fields marked <span className="text-royal font-bold">*</span> are required.</p>

            <p className="text-xs font-semibold uppercase tracking-widest text-royal mb-3">School / Institution Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {[{ name:"schoolName", label:"School name", req:true, placeholder:"e.g. Kendriya Vidyalaya No. 1", type:"text" },{ name:"contactPerson", label:"Contact person", req:true, placeholder:"Your full name", type:"text" },{ name:"designation", label:"Designation", req:false, placeholder:"e.g. ATL Coordinator", type:"text" },{ name:"phone", label:"Phone number", req:true, placeholder:"+91 XXXXX XXXXX", type:"tel" },{ name:"email", label:"Email address", req:true, placeholder:"school@email.com", type:"email" }].map(({ name, label, req, placeholder, type }) => (
                <div key={name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500">{label} {req && <span className="text-royal">*</span>}</label>
                  <input name={name} value={form[name]} onChange={handleChange} required={req} type={type} placeholder={placeholder} className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-royal focus:ring-2 focus:ring-blue-100" />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">State <span className="text-royal">*</span></label>
                <select name="state" value={form.state} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-royal bg-white">
                  <option value="">Select state</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <hr className="border-gray-200 my-5" />
            <p className="text-xs font-semibold uppercase tracking-widest text-royal mb-2">Kit Selection</p>
            <p className="text-xs text-gray-500 mb-3">Select one or more kits you are interested in</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {ATL_KITS.map(({ id, label, price }) => (
                <label key={id} className={"flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all " + (selectedKits.includes(id) ? "border-royal bg-blue-50" : "border-gray-200 hover:border-blue-300")}>
                  <input type="checkbox" checked={selectedKits.includes(id)} onChange={() => toggleKit(id)} className="mt-0.5 w-4 h-4 flex-shrink-0 accent-royal" />
                  <div><p className="text-sm font-medium text-navy">{label}</p><p className="text-xs text-royal mt-0.5">{price}</p></div>
                </label>
              ))}
            </div>

            <hr className="border-gray-200 my-5" />
            <p className="text-xs font-semibold uppercase tracking-widest text-royal mb-3">Order Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Quantity required <span className="text-royal">*</span></label>
                <input name="quantity" value={form.quantity} onChange={handleChange} required type="number" min="1" placeholder="e.g. 20" className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-royal focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Budget range</label>
                <select name="budgetRange" value={form.budgetRange} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-royal bg-white">
                  <option value="">Select range</option>
                  {BUDGET_RANGES.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-medium text-gray-500">ATL Lab UDISE code</label>
              <input name="udise" value={form.udise} onChange={handleChange} placeholder="12-digit UDISE code (if available)" className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-royal focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-xs font-medium text-gray-500">Additional requirements</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Mention any specific components, delivery timeline, demo request, etc." className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-navy outline-none focus:border-royal resize-y" />
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-royal hover:bg-navy text-white font-semibold py-3 rounded-lg transition-colors text-base">
              <Send size={18} /> Submit Enquiry
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">By submitting, you agree to be contacted by the Hardvanta sales team.</p>
          </form>

          <aside className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-navy flex items-center gap-2 mb-4"><Phone size={16} className="text-royal" /> Contact us directly</h3>
              {[{ Icon:Phone, strong:"+91 91705 46395", sub:"Mon - Sat, 9 AM - 6 PM" },{ Icon:Mail, strong:"atl@hardvantatechnology@gmail.com", sub:"Enquiries responded within 48 hrs" },{ Icon:MapPin, strong:"Pan-Delhi-NCR shipping", sub:"Delivered with GST invoice" }].map(({ Icon, strong, sub }) => (
                <div key={strong} className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-none">
                  <Icon size={16} className="text-royal mt-0.5 flex-shrink-0" />
                  <div><p className="text-sm font-medium text-navy">{strong}</p><p className="text-xs text-gray-500 mt-0.5">{sub}</p></div>
                </div>
              ))}
            </div>

            <div className="bg-navy rounded-2xl p-5 text-white">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><BadgeCheck size={16} /> Why Hardvanta ATL Kits?</h3>
              {["AIM / NITI Aayog aligned curriculum","GST compliant billing for schools","Bulk discount on 10+ units","Free teacher training material","Warranty & replacement support","Demo available for institutions"].map((feat) => (
                <div key={feat} className="flex items-center gap-2 py-1.5 text-sm text-white/80">
                  <CheckCircle2 size={14} className="text-blue-300 flex-shrink-0" />{feat}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-navy flex items-center gap-2 mb-4"><FileText size={16} className="text-royal" /> Procurement process</h3>
              {[{ Icon:Clock, strong:"Quote in 48 hours", sub:"After form submission" },{ Icon:FileText, strong:"PO accepted", sub:"School / trust purchase orders" },{ Icon:Truck, strong:"Delivery 7 - 14 days", sub:"Pan-Delhi-NCR, tracked shipment" }].map(({ Icon, strong, sub }) => (
                <div key={strong} className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-none">
                  <Icon size={16} className="text-royal mt-0.5 flex-shrink-0" />
                  <div><p className="text-sm font-medium text-navy">{strong}</p><p className="text-xs text-gray-500 mt-0.5">{sub}</p></div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
