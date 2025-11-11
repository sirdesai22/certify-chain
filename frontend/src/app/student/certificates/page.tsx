"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import { useStudentCertificates } from "@/hooks/use-certificates";

export default function StudentCertificatesPage() {
  const { user, loading: userLoading } = useUser();
  const {
    data: certificates,
    loading,
    error,
    refresh,
  } = useStudentCertificates(user?.id);

  const isEmpty = !loading && !error && !userLoading && certificates.length === 0;

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Certificates</h1>
            <p className="mt-2 text-muted-foreground">
              View, download, and share your verified academic credentials.
            </p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading || userLoading}>
            Refresh
          </Button>
        </header>

        {(loading || userLoading) && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Fetching certificates from the ledger...
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center text-sm text-destructive">
            Unable to load certificates: {error}
          </div>
        )}

        {isEmpty && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            No certificates found yet. Check back after your institution issues credentials to you.
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          {certificates.map((certificate) => (
            <Card key={certificate.id}>
              <CardHeader>
                <CardTitle>{certificate.title}</CardTitle>
                <CardDescription>Issued by {certificate.issuedBy}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>Issued on: {new Date(certificate.issueDate).toLocaleDateString()}</div>
                <div>Status: {certificate.status}</div>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link href={`/student/certificates/${certificate.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Download PDF
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


