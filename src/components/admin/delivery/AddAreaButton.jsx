"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import AddAreaModal from "./AddAreaModal";

export default function AddAreaButton({ onCreate }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="gradient" onClick={() => setOpen(true)}>
        <Plus size={16} /> Add City
      </Button>
      <AddAreaModal open={open} onClose={() => setOpen(false)} onSave={onCreate} />
    </>
  );
}
