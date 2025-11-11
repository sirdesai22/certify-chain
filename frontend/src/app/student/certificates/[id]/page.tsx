"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCertificateById } from "@/hooks/use-certificates";

export default function StudentCertificateDetailPage() {
  const params = useParams<{ id: string }>();
  const certificateId = params?.id;

  const { certificate, loading, error, refresh } = useCertificateById(certificateId);

  const issuedOn = certificate ? new Date(certificate.issue_date).toLocaleDateString() : null;

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild className="w-fit">
            <Link href="/student/certificates">Back to Certificates</Link>
          </Button>
          <Button variant="outline" onClick={refresh} disabled={loading}>
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
              <CardDescription>Issued by {certificate.institution?.name ?? "Unknown Institution"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="grid gap-2 md:grid-cols-2">
                <p>Certificate ID: {certificate.certificate_id}</p>
                <p>Issued on: {issuedOn}</p>
                <p>Student Wallet: {certificate.student?.wallet_address ?? "N/A"}</p>
                <p>
                  Institution Wallet: {certificate.institution_wallet ?? "N/A"}
                </p>
                <p>IPFS CID: {certificate.ipfs_cid}</p>
                <p>Hash: {certificate.hash}</p>
                <p>Status: {certificate.revoked ? "Revoked" : "Active"}</p>
              </div>
              {certificate.description && <p>{certificate.description}</p>}
              <div className="flex gap-2">
                <Button>Download PDF</Button>
                <Button variant="outline">Share Link</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}


