"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import Button from "@/components/ui/Button";

export default function SignOutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/" })}
      variant="glass"
      className="w-full !justify-center hover:!shadow-[0_0_40px_-8px_rgba(248,113,113,0.45)] hover:!text-red-400"
    >
      <LogOut size={16} /> Sign out
    </Button>
  );
}
