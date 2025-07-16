"use client";

import React, { useState } from "react";

export default function PasswordCheckPage() {
  const [password, setPassword] = useState("");
type PasswordCheckResult = {
  breached: boolean;
  count: number;
};

const [result, setResult] = useState<PasswordCheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!password) return;

    try {
      const res = await fetch(`/api/password-check?password=${encodeURIComponent(password)}`);
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error checking password", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">🔒 Password Breach Checker</h1>
      <p className="text-black-400 mb-6 text-center">Your password is never fully sent to the server – totally private and safe.</p>
      <input
        type="password"
        className="text-black border border-zinc-500 px-4 py-2 rounded w-full max-w-md mb-4"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleCheck}
        className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-2 rounded mb-4 disabled:opacity-60"
        disabled={loading || !password}
      >
        {loading ? "Checking..." : "Check Password"}
      </button>

      {result && (
        <div className="text-center max-w-lg">
          {result.breached ? (
            <p className="text-red-500 font-medium">
              ⚠️ This password has been found in{" "}
              <span className="font-bold">{result.count}</span> data breaches. Avoid using it.
            </p>
          ) : (
            <p className="text-green-500 font-medium">
              ✅ This password has not been found in any known breach.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
