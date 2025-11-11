"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAnalytics } from "@/hooks/use-admin";

const formatNumber = (value: number) => value.toLocaleString();

export default function AdminAnalyticsPage() {
  const {
    data: metrics,
    loading,
    error,
    refresh,
  } = useAdminAnalytics();

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Analytics</h1>
            <p className="mt-2 text-muted-foreground">
              Monitor key performance indicators to understand platform adoption and usage.
            </p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading}>
            Refresh
          </Button>
        </header>

        {loading && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Gathering latest metrics...
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && metrics.length === 0 && (
          <div className="rounded-lg border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Analytics data will appear once certificates and verifications are recorded.
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardHeader>
                <CardTitle>{formatNumber(metric.value)}</CardTitle>
                <CardDescription>{metric.label}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {metric.description ?? "Real-time snapshot from Supabase mirrors."}
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}


