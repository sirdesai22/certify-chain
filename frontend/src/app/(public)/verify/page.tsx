"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCertificateLookup } from "@/hooks/use-certificates";
import { useVerificationLogs } from "@/hooks/use-admin";

export default function VerifyPage() {
  const [identifier, setIdentifier] = useState("");
  const { certificate, loading, error, search, reset } = useCertificateLookup();
  const {
    data: logs,
    loading: logsLoading,
    refresh: refreshLogs,
  } = useVerificationLogs(certificate?.certificate_id ? { certificateId: certificate.certificate_id } : { limit: 0 });

  const handleVerify = async () => {
    await search(identifier);
    refreshLogs();
  };

  const handleReset = () => {
    setIdentifier("");
    reset();
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Verify a Certificate</CardTitle>
          <CardDescription className="text-center">
            Enter the certificate ID or hash to verify its authenticity instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Certificate ID or transaction hash"
              className="w-full"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleVerify();
                }
              }}
            />
            <Button onClick={() => void handleVerify()} disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
            {certificate && (
              <Button variant="outline" onClick={handleReset} disabled={loading}>
                Clear
              </Button>
            )}
          </div>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {certificate && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                <p className="text-base font-semibold text-foreground">{certificate.title}</p>
                <p>
                  Issued to <strong>{certificate.student?.name ?? certificate.student_wallet}</strong> by{" "}
                  <strong>{certificate.institution?.name ?? certificate.institution_wallet}</strong>
                </p>
                <p>Issued on: {new Date(certificate.issue_date).toLocaleDateString()}</p>
                <p>Hash: {certificate.hash}</p>
                <p>IPFS CID: {certificate.ipfs_cid}</p>
                <p>Status: {certificate.revoked ? "Revoked" : "Active"}</p>
                <div className="mt-4 flex gap-2">
                  <Button asChild size="sm">
                    <Link href={`/employer/certificates/${certificate.certificate_id}`}>Employer view</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/student/certificates/${certificate.certificate_id}`} target="_blank">
                      Student view
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Recent verification attempts</h3>
                {logsLoading && (
                  <p className="text-xs text-muted-foreground">Loading verification activity...</p>
                )}
                {logs.length === 0 && (
                  <p className="text-xs text-muted-foreground">No verification attempts recorded yet.</p>
                )}
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.log_id}
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground"
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
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}


