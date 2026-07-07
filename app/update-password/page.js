"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdatePassword(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill out both password fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password updated. Redirecting to login...");

    setTimeout(() => {
      router.push("/login");
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <div className="mb-6">
          <Link href="/" className="text-sm text-blue-700 font-semibold">
            ← Back to CaseKeep
          </Link>

          <h1 className="text-3xl font-bold mt-4 text-gray-950">
            Create a new password
          </h1>

          <p className="text-gray-600 mt-2">
            Enter and confirm your new password.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-800">
              New password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-950 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-800">
              Confirm new password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-950 bg-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold disabled:opacity-60"
          >
            {isLoading ? "Updating password..." : "Update password"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-700 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}