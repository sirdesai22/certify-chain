"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/userContext";
import { createClient } from "@/lib/supabase/client";

const resolveInstitutionId = (user: ReturnType<typeof useUser>["user"]) => {
  if (!user) return null;
  if (user.role === "institution") {
    return user.institute_id ?? user.id;
  }
  return user.institute_id;
};

export default function IssueCertificatePage() {
  const { user } = useUser();
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const institutionId = resolveInstitutionId(user);

  const [formState, setFormState] = useState({
    studentWallet: "",
    title: "",
    description: "",
    file: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: string, value: string | File | null) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user?.wallet_address) {
      setError("Your institution wallet is not configured. Please update your profile first.");
      return;
    }

    if (!institutionId) {
      setError("Institution record missing. Contact platform administrator.");
      return;
    }

    setSubmitting(true);

    try {
      const { data: studentRecord, error: studentError } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", formState.studentWallet.trim())
        .eq("role", "student")
        .maybeSingle();

      if (studentError) {
        throw studentError;
      }

      if (!studentRecord) {
        setError("No student found with the provided wallet address.");
        setSubmitting(false);
        return;
      }

      const generatedCid = formState.file?.name ? `file://${formState.file.name}` : `generated-${crypto.randomUUID().slice(0, 8)}`;
      const generatedHash = `0x${crypto.randomUUID().replace(/-/g, "").slice(0, 32)}`;

      const { error: insertError } = await supabase.from("certificates_meta").insert({
        student_id: studentRecord.id,
        institution_id: institutionId,
        student_wallet: formState.studentWallet.trim(),
        institution_wallet: user.wallet_address,
        title: formState.title.trim(),
        description: formState.description.trim() || null,
        ipfs_cid: generatedCid,
        hash: generatedHash,
        metadata: {
          uploaded_filename: formState.file?.name ?? null,
          issued_by: user.name,
        },
      });

      if (insertError) {
        throw insertError;
      }

      setSuccess("Certificate issued and recorded in Supabase. It may take a moment to appear on dashboards.");

      setFormState({
        studentWallet: "",
        title: "",
        description: "",
        file: null,
      });
      router.push("/institution/certificates");
    } catch (err) {
      console.error("Failed to issue certificate", err);
      setError((err as Error).message ?? "Failed to issue certificate");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Issue Certificate</CardTitle>
            <CardDescription>
              Upload certificate details, link a student wallet, and push the credential on-chain.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="studentWallet">Student Wallet Address</Label>
                <Input
                  id="studentWallet"
                  placeholder="0x..."
                  value={formState.studentWallet}
                  onChange={(event) => handleChange("studentWallet", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Certificate Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  value={formState.title}
                  onChange={(event) => handleChange("title", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide additional details about this credential."
                  value={formState.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Certificate PDF</Label>
                <Input
                  id="file"
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => handleChange("file", event.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-muted-foreground">
                  File uploads to IPFS/Storage are not wired yet. The filename is stored for reference.
                </p>
              </div>

              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3 text-sm text-emerald-500">
                  {success}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Issuing..." : "Issue Certificate"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


