"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Shield, Wallet, ArrowLeft, Building2 } from "lucide-react";
import supabase from "@/lib/supabase/client";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { user } = useUser();
  const router = useRouter();

  if (user) {
    router.push("/institute");
  } else {
    router.push("/login/institute");
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const redirectUrl = new URL("/api/auth/callback", origin);
      if (next) {
        redirectUrl.searchParams.set("next", next);
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl.toString(),
          queryParams: {
            prompt: "consent",
            access_type: "offline",
          },
        },
      });
      if (error) setError(error.message);
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-xl"
          >
            <Shield className="h-6 w-6 text-primary" />
            <span>CertChain</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="w-full">
            <Button asChild variant="ghost" size="sm" className="mb-2 self-start w-fit">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex flex-col items-center space-y-2">
              <div className="inline-flex h-16 w-16 items-center justify-center mb-2">
              <Building2 className="text-primary w-14 h-14" />
              </div>
              <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Institute Portal
              </span>
              <CardTitle className="text-3xl font-bold text-balance">
                Institute Sign in with Google
              </CardTitle>
              <CardDescription className="text-center leading-relaxed">
                Sign in with your institute Google account to securely access the platform.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="w-full h-auto py-4 px-4 text-center flex justify-center relative bg-transparent mx-auto"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <GoogleIcon />
                Sign in with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            By connecting, you agree to our{" "}
            <Link href="#" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
