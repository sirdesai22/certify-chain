"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GraduationCap, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/userContext";

export default function LoginSelectPage() {
  const router = useRouter();

  const options = [
    {
      label: "Student",
      description: "Access your certificates and credentials as a student.",
      icon: GraduationCap,
      onClick: () => router.push("/login/student"),
      color: "from-blue-500 via-sky-400 to-blue-400",
      border: "border-blue-500/40",
    },
    {
      label: "Institute",
      description: "Manage certificates and issue credentials as an institute.",
      icon: Building2,
      onClick: () => router.push("/login/institute"),
      color: "from-violet-600 via-purple-400 to-indigo-400",
      border: "border-violet-500/40",
    },
  ];

  //check if user already logged in
  const { user } = useUser();
  if (user) {
    if(user.onboarding_completed === false) {
      router.push(`/onboarding/${user.role}`);
    } else {
      router.push(`/${user.role}`);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-2xl border-2 md:border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl text-center font-bold tracking-tight mb-2">
            Welcome to CertChain
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Please select your role to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 mt-4">
            {options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={option.onClick}
                className={cn(
                  "group cursor-pointer flex-1 rounded-2xl p-0.5 transition-shadow hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                  `bg-gradient-to-tr ${option.color}`
                )}
              >
                <div
                  className={cn(
                    "flex flex-col items-center text-center justify-between px-7 py-9 h-full w-full rounded-2xl bg-white dark:bg-background border transition-transform transform hover:scale-[1.03] active:scale-100",
                    option.border
                  )}
                  style={{
                    minHeight: 212,
                    minWidth: 0,
                  }}
                >
                  <span
                    className={cn(
                      "rounded-full p-4 mb-3 bg-gradient-to-tr",
                      option.color,
                      "text-white shadow-lg"
                    )}
                  >
                    <option.icon className="w-8 h-8" />
                  </span>
                  <span className="text-xl font-semibold mb-2">
                    {option.label}
                  </span>
                  <span className="text-muted-foreground text-sm leading-snug">
                    {option.description}
                  </span>
                  <span className={cn(
                    "opacity-0 group-hover:opacity-100 transition mt-4 text-sm font-medium bg-gradient-to-tr px-4 py-1 rounded-full text-white shadow",
                    option.color
                  )}>
                    Continue as {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="w-full text-center mt-7 text-muted-foreground">
            Not sure?{" "}
            <span className="underline underline-offset-2 font-medium cursor-pointer transition hover:text-primary">
              <a href="mailto:support@certchain.com">
                Contact Support
              </a>
            </span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

