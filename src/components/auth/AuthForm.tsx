
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export default function AuthForm() {
  const { signIn, signUp, loading } = useSupabaseAuth();
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    setSuccessMsg(null);
    if (view === "sign-in") {
      const { error } = await signIn(email, password);
      if (error) setErrMsg(error.message || "Login failed");
    } else {
      const { error } = await signUp(email, password);
      if (error) setErrMsg(error.message || "Signup failed");
      else setSuccessMsg("Signup successful! Please check your email to confirm.");
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-24 bg-card p-6 rounded-xl border shadow">
      <h2 className="font-bold text-xl mb-2 text-center">
        {view === "sign-in" ? "Sign In" : "Sign Up"}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          autoComplete={view === "sign-in" ? "current-password" : "new-password"}
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {view === "sign-in" ? "Login" : "Register"}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        {view === "sign-in" ? (
          <>
            No account?{" "}
            <button
              className="underline text-accent font-medium"
              onClick={() => setView("sign-up")}
              disabled={loading}
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Have an account?{" "}
            <button
              className="underline text-accent font-medium"
              onClick={() => setView("sign-in")}
              disabled={loading}
            >
              Sign in
            </button>
          </>
        )}
      </div>
      {errMsg && <div className="mt-2 text-red-600 text-sm">{errMsg}</div>}
      {successMsg && <div className="mt-2 text-green-600 text-sm">{successMsg}</div>}
    </div>
  );
}
