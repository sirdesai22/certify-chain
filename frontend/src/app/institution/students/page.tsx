"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import { useInstitutionStudents } from "@/hooks/use-institutions";

const resolveInstitutionId = (user: ReturnType<typeof useUser>["user"]) => {
  if (!user) return null;
  if (user.role === "institution") {
    return user.institute_id ?? user.id;
  }
  return user.institute_id;
};

export default function InstitutionStudentsPage() {
  const { user, loading: userLoading } = useUser();
  const institutionId = resolveInstitutionId(user);
  const {
    data: students,
    loading,
    error,
    refresh,
  } = useInstitutionStudents(institutionId);

  const isEmpty = !loading && !error && !userLoading && students.length === 0;

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="mt-2 text-muted-foreground">
              Manage student access, keep contact information updated, and issue new credentials.
            </p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading || userLoading}>
            Refresh
          </Button>
        </header>

        {(loading || userLoading) && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Loading students...
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {isEmpty && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            No students linked to your institution yet.
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          {students.map((student) => (
            <Card key={student.id}>
              <CardHeader>
                <CardTitle>{student.name ?? "Unnamed Student"}</CardTitle>
                <CardDescription>Wallet: {student.wallet_address ?? "Not linked"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>Email: {student.email ?? "Not provided"}</div>
                <div className="flex gap-2">
                  <Button size="sm" disabled>
                    Issue Certificate
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    View History
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


