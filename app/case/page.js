"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import CaseTracker from "./CaseTracker";

export default function CasePage() {
  const router = useRouter();
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkLogin() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!session) {
        router.replace("/login");
        return;
      }

      setCheckingLogin(false);
    }

    checkLogin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (checkingLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F1EA] px-6 text-[#2B2D42]">
        <div className="w-full max-w-sm rounded-2xl border border-[#DED8CF] bg-white p-8 text-center shadow-[0_12px_32px_rgba(43,45,66,0.08)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2B2D42] text-lg font-extrabold text-[#F5F1EA]">
            CK
          </div>

          <p className="mt-5 text-xl font-extrabold">
            Checking your CaseKeep account
          </p>

          <p className="mt-2 text-sm text-[#7D7C84]">
            Please wait while we securely load your case.
          </p>

          <div className="mx-auto mt-6 h-2 w-full overflow-hidden rounded-full bg-[#E8E3DB]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#B5443B]" />
          </div>
        </div>
      </div>
    );
  }

  return <CaseTracker />;
}