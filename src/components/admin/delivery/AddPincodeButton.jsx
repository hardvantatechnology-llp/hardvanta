"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import PincodeFormModal from "./PincodeFormModal";

export default function AddPincodeButton({ areas, onCreate }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="gradient" onClick={() => setOpen(true)}>
        <Plus size={16} /> Add Pincode
      </Button>
      <PincodeFormModal open={open} onClose={() => setOpen(false)} areas={areas} onSave={onCreate} />
    </>
  );
}
