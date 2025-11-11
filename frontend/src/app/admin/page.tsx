"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const adminSections = [
  { href: "/admin/institutions", label: "Institutions", description: "Review and approve institution onboarding requests." },
  { href: "/admin/logs", label: "Verification Logs", description: "Monitor system activity and verification attempts." },
  { href: "/admin/analytics", label: "Analytics", description: "Track platform usage and verification metrics." },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <section>
          <h1 className="text-3xl font-bold">Admin Control Center</h1>
          <p className="mt-2 text-muted-foreground">
            Manage institutions, oversee verification activity, and review system metrics.
          </p>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {adminSections.map((section) => (
            <Card key={section.href}>
              <CardHeader>
                <CardTitle>{section.label}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={section.href}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}


