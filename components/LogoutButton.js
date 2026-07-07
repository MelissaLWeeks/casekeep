"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="border border-gray-300 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold"
    >
      Log out
    </button>
  );
}