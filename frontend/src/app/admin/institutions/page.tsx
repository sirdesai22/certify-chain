"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePendingInstitutions } from "@/hooks/use-institutions";

export default function AdminInstitutionsPage() {
  const {
    data: pendingInstitutions,
    loading,
    error,
    refresh,
  } = usePendingInstitutions();

  const isEmpty = !loading && !error && pendingInstitutions.length === 0;

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Institution Approvals</h1>
            <p className="mt-2 text-muted-foreground">
              Review institution applications and approve trusted issuers before they can issue certificates.
            </p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading}>
            Refresh
          </Button>
        </header>

        {loading && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Loading pending institutions...
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {isEmpty && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            No pending institutions. Approved issuers can immediately issue certificates.
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          {pendingInstitutions.map((institution) => (
            <Card key={institution.id}>
              <CardHeader>
                <CardTitle>{institution.name}</CardTitle>
                <CardDescription>Contact: {institution.email ?? "Not provided"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>Submitted on: {new Date(institution.created_at).toLocaleDateString()}</div>
                <div>Address: {institution.address ?? "Not provided"}</div>
                <div className="flex gap-2">
                  <Button size="sm" disabled>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    Reject
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


