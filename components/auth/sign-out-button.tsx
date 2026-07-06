"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/magic-link";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleSignOut}>
      <LogOut className="h-4 w-4" /> Sign out
    </Button>
  );
}
