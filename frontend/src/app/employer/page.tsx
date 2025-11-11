"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const employerLinks = [
  { href: "/employer/verify", label: "Verify Certificate", description: "Enter an ID or hash to verify credentials." },
  { href: "/employer/scan", label: "Scan QR Code", description: "Use your camera to scan certificate QR codes." },
  {
    href: "/employer/certificates/demo",
    label: "View Certificate",
    description: "Review detailed certificate information.",
  },
];

export default function EmployerPortalPage() {
  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <section>
          <h1 className="text-3xl font-bold">Employer Portal</h1>
          <p className="mt-2 text-muted-foreground">
            Verify certificates instantly and review credential details provided by partnering institutions.
          </p>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {employerLinks.map((link) => (
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


