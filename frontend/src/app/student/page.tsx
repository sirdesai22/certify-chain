"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/userContext";

const quickActions = [
  { label: "View Certificates", href: "/student/certificates" },
  { label: "Update Profile", href: "/student/profile" },
  { label: "Verify a Certificate", href: "/verify" },
];

export default function StudentDashboardPage() {
  const { user, loading } = useUser();

  const welcomeMessage = useMemo(() => {
    if (loading) return "Loading your dashboard...";
    if (user?.name) return `Welcome back, ${user.name}!`;
    return "Welcome to CertifyChain";
  }, [loading, user?.name]);

  return (
    <>
    <nav className="flex justify-end p-3">
        <Button className="text-white border font-semibold border-gray-400 bg-transparent hover:bg-red-400">Logout</Button>
      </nav>
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section>
          <h1 className="text-3xl font-bold">{welcomeMessage}</h1>
          <p className="mt-2 text-muted-foreground">
            Access your verified certificates, manage your credentials, and share them securely with employers.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Card key={action.label}>
              <CardHeader>
                <CardTitle className="text-lg">{action.label}</CardTitle>
                <CardDescription>Navigate to the {action.label.toLowerCase()} section.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href={action.href}>Go</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
    </>
  );
}


