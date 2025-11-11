"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCertificateById } from "@/hooks/use-certificates";
import { useVerificationLogs } from "@/hooks/use-admin";

export default function EmployerCertificateDetailPage() {
  const params = useParams<{ id: string }>();
  const certificateId = params?.id;

  const { certificate, loading, error, refresh } = useCertificateById(certificateId);

  const numericCertificateId =
    certificateId && !Number.isNaN(Number.parseInt(certificateId, 10))
      ? Number.parseInt(certificateId, 10)
      : undefined;

  const {
    data: logs,
    loading: logsLoading,
    refresh: refreshLogs,
  } = useVerificationLogs(numericCertificateId ? { certificateId: numericCertificateId } : { limit: 0 });

  const handleRefresh = () => {
    refresh();
    if (numericCertificateId) {
      refreshLogs();
    }
  };

  const issuedOn = certificate ? new Date(certificate.issue_date).toLocaleDateString() : null;

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="w-fit">
            <Link href="/employer/verify">Back to Verification</Link>
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={loading || logsLoading}>
            Refresh
          </Button>
        </div>

        {loading && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Loading certificate details...
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && !certificate && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Certificate not found.
          </div>
        )}

        {certificate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{certificate.title}</CardTitle>
              <CardDescription>
                Issued to {certificate.student?.name ?? certificate.student_wallet ?? "Unknown Student"} by{" "}
                {certificate.institution?.name ?? certificate.institution_wallet ?? "Unknown Institution"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="grid gap-2 md:grid-cols-2">
                <p>Certificate ID: {certificate.certificate_id}</p>
                <p>Issued on: {issuedOn}</p>
                <p>IPFS CID: {certificate.ipfs_cid}</p>
                <p>Hash: {certificate.hash}</p>
                <p>Status: {certificate.revoked ? "Revoked" : "Active"}</p>
                <p>Student Wallet: {certificate.student?.wallet_address ?? certificate.student_wallet ?? "N/A"}</p>
                <p>Institution Wallet: {certificate.institution_wallet ?? "N/A"}</p>
              </div>
              {certificate.description && <p>{certificate.description}</p>}
              <div className="flex gap-2">
                <Button size="sm">Download Certificate</Button>
                <Button variant="outline" size="sm">
                  Report Issue
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Verification history</h3>
                {logsLoading && <p className="text-xs text-muted-foreground">Loading verification logs...</p>}
                {!logsLoading && logs.length === 0 && (
                  <p className="text-xs text-muted-foreground">No verification attempts recorded.</p>
                )}
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.log_id}
                      className="rounded-md border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground"
                    >
                      <div className="flex items-center justify-between">
                        <span>{new Date(log.created_at).toLocaleString()}</span>
                        <span className={log.success ? "text-emerald-500" : "text-destructive"}>
                          {log.success ? "Success" : "Failed"}
                        </span>
                      </div>
                      <div>Method: {log.method ?? "Unknown"}</div>
                      {log.notes && <div>Notes: {log.notes}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}


