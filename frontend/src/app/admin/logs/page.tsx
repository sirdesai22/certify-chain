"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVerificationLogs } from "@/hooks/use-admin";

export default function AdminLogsPage() {
  const {
    data: logs,
    loading,
    error,
    refresh,
  } = useVerificationLogs();

  const isEmpty = !loading && !error && logs.length === 0;

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Verification Logs</h1>
            <p className="mt-2 text-muted-foreground">
              Audit all verification attempts and certificate lifecycle changes across the platform.
            </p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading}>
            Refresh
          </Button>
        </header>

        {loading && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Loading activity...
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {isEmpty && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            No verification activity logged yet.
          </div>
        )}

        <section className="space-y-4">
          {logs.map((log) => (
            <Card key={log.log_id}>
              <CardHeader>
                <CardTitle>{log.success ? "Verification succeeded" : "Verification failed"}</CardTitle>
                <CardDescription>{new Date(log.created_at).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Certificate ID: {log.certificate_id}</p>
                <p>Method: {log.method ?? "Unknown"}</p>
                <p>Verified By: {log.verifier?.name ?? log.verifier?.email ?? "Anonymous"}</p>
                {log.notes && <p>Notes: {log.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}


