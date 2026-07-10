"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/case");
  }

    return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F1EA] px-6 py-12 text-[#2B2D42]">
      <div className="w-full max-w-md rounded-2xl border border-[#DED8CF] bg-white p-8 shadow-[0_12px_32px_rgba(43,45,66,0.08)]">
        <div className="mb-6">
        <Link href="/" className="mb-6 inline-flex">
          <img
            src="/casekeep-logo-lockup.svg"
            alt="CaseKeep"
            className="h-14 w-auto"
          />
        </Link>  

          <h1 className="mt-4 text-3xl font-extrabold text-[#2B2D42]">
            Log in to CaseKeep
          </h1>

          <p className="mt-2 text-[#7D7C84]">
            Access your saved CaseKeep records.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2B2D42]">
              Email
            </label>

            <input
              type="email"
              className="w-full rounded-xl border border-[#DED8CF] bg-white px-3 py-2.5 text-[#2B2D42] focus:border-[#B5443B] focus:outline-none focus:ring-4 focus:ring-[#B5443B]/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#2B2D42]">
              Password
            </label>

            <input
              type="password"
              className="w-full rounded-xl border border-[#DED8CF] bg-white px-3 py-2.5 text-[#2B2D42] focus:border-[#B5443B] focus:outline-none focus:ring-4 focus:ring-[#B5443B]/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-[#E4B7B2] bg-[#F8E9E7] px-3 py-2 text-sm text-[#7A2F29]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{ color: "#F5F1EA" }}
            className="w-full rounded-xl bg-[#B5443B] px-4 py-3 font-bold transition hover:bg-[#9F3932] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-sm text-[#7D7C84]">
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#B5443B] hover:underline"
            >
              Create one
            </Link>
          </p>

          <p>
            Forgot your password?{" "}
            <Link
              href="/reset-password"
              className="font-semibold text-[#B5443B] hover:underline"
            >
              Reset it
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}