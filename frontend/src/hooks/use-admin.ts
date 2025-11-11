"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CertificateDetail } from "./use-certificates";

const useSupabaseMemo = () => useMemo(() => createClient(), []);

export type VerificationLog = {
  log_id: string;
  certificate_id: number;
  success: boolean;
  method: string | null;
  notes: string | null;
  created_at: string;
  certificate?: Pick<CertificateDetail, "certificate_id" | "title" | "revoked"> | null;
  verifier?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

type HookState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

type VerificationLogOptions = {
  limit?: number;
  certificateId?: number;
};

export function useVerificationLogs(options?: VerificationLogOptions): HookState<VerificationLog[]> {
  const supabase = useSupabaseMemo();
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("verification_logs")
      .select(
        `
        log_id,
        certificate_id,
        success,
        method,
        notes,
        created_at,
        certificate:certificates_meta (
          certificate_id,
          title,
          revoked
        ),
        verifier:users (
          id,
          name,
          email
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(options?.limit ?? 20);

    if (options?.certificateId) {
      query = query.eq("certificate_id", options.certificateId);
    }

    const { data, error: supabaseError } = await query;

    if (supabaseError) {
      setError(supabaseError.message);
      setLogs([]);
    } else {
      setLogs((data ?? []) as VerificationLog[]);
    }

    setLoading(false);
  }, [options?.certificateId, options?.limit, supabase]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  return {
    data: logs,
    loading,
    error,
    refresh: fetchLogs,
  };
}

export type AdminMetric = {
  label: string;
  value: number;
  description?: string;
};

export function useAdminAnalytics(): HookState<AdminMetric[]> {
  const supabase = useSupabaseMemo();
  const [metrics, setMetrics] = useState<AdminMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [
        certificatesCount,
        institutionsCount,
        verificationsThisMonth,
        revokedCount,
      ] = await Promise.all([
        supabase.from("certificates_meta").select("certificate_id", { count: "exact", head: true }),
        supabase.from("institutions").select("id", { count: "exact", head: true }).eq("approved", true),
        supabase
          .from("verification_logs")
          .select("log_id", { count: "exact", head: true })
          .gte("created_at", startOfMonth)
          .eq("success", true),
        supabase.from("certificates_meta").select("certificate_id", { count: "exact", head: true }).eq("revoked", true),
      ]);

      setMetrics([
        {
          label: "Total Certificates Issued",
          value: certificatesCount.count ?? 0,
        },
        {
          label: "Active Institutions",
          value: institutionsCount.count ?? 0,
        },
        {
          label: "Verifications This Month",
          value: verificationsThisMonth.count ?? 0,
        },
        {
          label: "Revoked Certificates",
          value: revokedCount.count ?? 0,
        },
      ]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to load analytics.");
      setMetrics([]);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchMetrics();
  }, [fetchMetrics]);

  return {
    data: metrics,
    loading,
    error,
    refresh: fetchMetrics,
  };
}


