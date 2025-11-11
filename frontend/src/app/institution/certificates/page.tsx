"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/userContext";
import { useInstitutionCertificates } from "@/hooks/use-certificates";

const resolveInstitutionId = (user: ReturnType<typeof useUser>["user"]) => {
  if (!user) return null;
  if (user.role === "institution") {
    return user.institute_id ?? user.id;
  }
  return user.institute_id;
};

export default function InstitutionCertificatesPage() {
  const { user, loading: userLoading } = useUser();
  const institutionId = resolveInstitutionId(user);

  const {
    data: certificates,
    loading,
    error,
    refresh,
  } = useInstitutionCertificates(institutionId);

  const isEmpty = !loading && !error && !userLoading && certificates.length === 0;

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Issued Certificates</h1>
            <p className="mt-2 text-muted-foreground">
              Track certificates issued by your institution and manage their lifecycle.
            </p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading || userLoading}>
            Refresh
          </Button>
        </header>

        {(loading || userLoading) && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Loading issued certificates...
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {isEmpty && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            No certificates issued yet. Start issuing credentials from the Issue Certificate page.
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          {certificates.map((certificate) => (
            <Card key={certificate.id}>
              <CardHeader>
                <CardTitle>{certificate.title}</CardTitle>
                <CardDescription>Issued for {certificate.studentName ?? "Unknown Student"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>Issued on: {new Date(certificate.issueDate).toLocaleDateString()}</div>
                <div>Status: {certificate.status}</div>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href={`/institution/certificates/${certificate.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Revoke
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}


