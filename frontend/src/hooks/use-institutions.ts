"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type InstitutionRecord = {
  id: string;
  name: string;
  email: string;
  address: string | null;
  website: string | null;
  approved: boolean;
  created_at: string;
};

export type InstitutionStudent = {
  id: string;
  name: string | null;
  email: string | null;
  wallet_address: string | null;
  created_at: string;
};

const useSupabaseMemo = () => useMemo(() => createClient(), []);

type HookState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useInstitutionStudents(institutionId?: string): HookState<InstitutionStudent[]> {
  const supabase = useSupabaseMemo();
  const [students, setStudents] = useState<InstitutionStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(institutionId));
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    if (!institutionId) {
      setStudents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: supabaseError } = await supabase
      .from("users")
      .select("id, name, email, wallet_address, created_at")
      .eq("institute_id", institutionId)
      .eq("role", "student")
      .order("created_at", { ascending: false });

    if (supabaseError) {
      setError(supabaseError.message);
      setStudents([]);
    } else {
      setStudents(data ?? []);
    }

    setLoading(false);
  }, [institutionId, supabase]);

  useEffect(() => {
    void fetchStudents();
  }, [fetchStudents]);

  return {
    data: students,
    loading,
    error,
    refresh: fetchStudents,
  };
}

export function useInstitutions(approved?: boolean): HookState<InstitutionRecord[]> {
  const supabase = useSupabaseMemo();
  const [institutions, setInstitutions] = useState<InstitutionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase.from("institutions").select("*").order("created_at", { ascending: false });
    if (approved !== undefined) {
      query = query.eq("approved", approved);
    }

    const { data, error: supabaseError } = await query;

    if (supabaseError) {
      setError(supabaseError.message);
      setInstitutions([]);
    } else {
      setInstitutions((data ?? []) as InstitutionRecord[]);
    }

    setLoading(false);
  }, [approved, supabase]);

  useEffect(() => {
    void fetchInstitutions();
  }, [fetchInstitutions]);

  return {
    data: institutions,
    loading,
    error,
    refresh: fetchInstitutions,
  };
}

export function usePendingInstitutions() {
  return useInstitutions(false);
}


