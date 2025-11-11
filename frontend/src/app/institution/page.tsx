"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/userContext";

const dashboardLinks = [
  { href: "/institution/issue", label: "Issue Certificate", description: "Upload and issue new certificates." },
  { href: "/institution/certificates", label: "Manage Certificates", description: "Review issued certificates." },
  { href: "/institution/students", label: "Manage Students", description: "Invite or manage student records." },
  { href: "/institution/profile", label: "Institution Profile", description: "Update institution information." },
];

export default function InstitutionDashboardPage() {
  const { user, loading } = useUser();

  const headline = useMemo(() => {
    if (loading) return "Loading your institution dashboard...";
    if (user?.name) return `Welcome, ${user.name}`;
    return "Institution Dashboard";
  }, [loading, user?.name]);

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section>
          <h1 className="text-3xl font-bold">{headline}</h1>
          <p className="mt-2 text-muted-foreground">
            Issue new credentials, manage student records, and keep your institution data up to date.
          </p>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          {dashboardLinks.map((link) => (
            <Card key={link.href}>
              <CardHeader>
                <CardTitle>{link.label}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={link.href}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}


