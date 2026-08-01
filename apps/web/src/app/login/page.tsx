"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "success">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setStep("success");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-xl shadow-primary/5 p-8 z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-foreground mb-2">Welcome</h1>
          <p className="text-muted-foreground font-light text-sm">
            {step === "email" 
              ? "Enter your email to receive a secure login link." 
              : "Check your inbox! We sent you a magic link."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        {step === "email" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full flex items-center justify-center h-12 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span className="mr-2">Send Magic Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {step === "success" && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-6 space-y-4 text-primary"
          >
            <CheckCircle2 className="w-16 h-16" />
            <p className="font-medium text-center">Magic link sent successfully.</p>
            <p className="text-sm text-muted-foreground font-light text-center">Please check your email and click the link to sign in securely.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
