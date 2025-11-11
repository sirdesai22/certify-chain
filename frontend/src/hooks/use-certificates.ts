"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type RelatedInstitution = {
  id: string;
  name: string | null;
  email?: string | null;
};

type RelatedStudent = {
  id: string;
  name: string | null;
  email?: string | null;
  wallet_address?: string | null;
};

export type CertificateSummary = {
  id: number;
  title: string;
  issuedBy: string;
  issueDate: string;
  status: "Verified" | "Revoked";
  studentName?: string;
};

export type CertificateDetail = {
  certificate_id: number;
  title: string;
  description: string | null;
  issue_date: string;
  revoked: boolean;
  ipfs_cid: string;
  hash: string;
  student_wallet?: string | null;
  institution_wallet?: string | null;
  metadata?: Record<string, unknown> | null;
  institution?: RelatedInstitution | null;
  student?: RelatedStudent | null;
};

type CertificatesState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const useSupabaseMemo = () => useMemo(() => createClient(), []);

export function useStudentCertificates(studentId?: string): CertificatesState<CertificateSummary[]> {
  const supabase = useSupabaseMemo();
  const [certificates, setCertificates] = useState<CertificateSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(studentId));
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    if (!studentId) {
      setCertificates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: supabaseError } = await supabase
      .from("certificates_meta")
      .select(
        `
        certificate_id,
        title,
        issue_date,
        revoked,
        institution:institutions (
          id,
          name
        )
      `
      )
      .eq("student_id", studentId)
      .order("issue_date", { ascending: false });

    if (supabaseError) {
      setError(supabaseError.message);
      setCertificates([]);
    } else {
      const mapped =
        data?.map((row) => ({
          id: row.certificate_id,
          title: row.title,
          issuedBy: row.institution?.name ?? "Unknown Institution",
          issueDate: row.issue_date,
          status: row.revoked ? "Revoked" : "Verified",
        })) ?? [];
      setCertificates(mapped);
    }

    setLoading(false);
  }, [studentId, supabase]);

  useEffect(() => {
    void fetchCertificates();
  }, [fetchCertificates]);

  return {
    data: certificates,
    loading,
    error,
    refresh: fetchCertificates,
  };
}

export function useInstitutionCertificates(institutionId?: string): CertificatesState<CertificateSummary[]> {
  const supabase = useSupabaseMemo();
  const [certificates, setCertificates] = useState<CertificateSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(institutionId));
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    if (!institutionId) {
      setCertificates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: supabaseError } = await supabase
      .from("certificates_meta")
      .select(
        `
        certificate_id,
        title,
        issue_date,
        revoked,
        student:users (
          id,
          name
        )
      `
      )
      .eq("institution_id", institutionId)
      .order("issue_date", { ascending: false });

    if (supabaseError) {
      setError(supabaseError.message);
      setCertificates([]);
    } else {
      const mapped =
        data?.map((row) => ({
          id: row.certificate_id,
          title: row.title,
          issuedBy: row.student?.name ?? "Unknown Student",
          issueDate: row.issue_date,
          status: row.revoked ? "Revoked" : "Verified",
          studentName: row.student?.name ?? undefined,
        })) ?? [];
      setCertificates(mapped);
    }

    setLoading(false);
  }, [institutionId, supabase]);

  useEffect(() => {
    void fetchCertificates();
  }, [fetchCertificates]);

  return {
    data: certificates,
    loading,
    error,
    refresh: fetchCertificates,
  };
}

export function useCertificateById(certificateId?: number | string) {
  const supabase = useSupabaseMemo();
  const [certificate, setCertificate] = useState<CertificateDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(certificateId));
  const [error, setError] = useState<string | null>(null);

  const fetchCertificate = useCallback(
    async (idParam?: number | string) => {
      const parsedId =
        typeof idParam === "string" ? Number.parseInt(idParam, 10) : typeof idParam === "number" ? idParam : undefined;

      if (!parsedId || Number.isNaN(parsedId)) {
        setCertificate(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("certificates_meta")
        .select(
          `
          certificate_id,
          title,
          description,
          issue_date,
          revoked,
          ipfs_cid,
          hash,
          student_wallet,
          institution_wallet,
          metadata,
          institution:institutions (
            id,
            name,
            email
          ),
          student:users (
            id,
            name,
            email,
            wallet_address
          )
        `
        )
        .eq("certificate_id", parsedId)
        .maybeSingle();

      if (supabaseError) {
        setError(supabaseError.message);
        setCertificate(null);
      } else {
        setCertificate(data as CertificateDetail);
      }

      setLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    if (certificateId !== undefined) {
      void fetchCertificate(certificateId);
    }
  }, [certificateId, fetchCertificate]);

  return {
    certificate,
    loading,
    error,
    refresh: fetchCertificate,
  };
}

export function useCertificateLookup() {
  const supabase = useSupabaseMemo();
  const [certificate, setCertificate] = useState<CertificateDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (targetId: string) => {
      const parsedId = Number.parseInt(targetId, 10);
      if (!targetId.trim() || Number.isNaN(parsedId)) {
        setError("Please enter a valid certificate ID.");
        setCertificate(null);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("certificates_meta")
        .select(
          `
          certificate_id,
          title,
          description,
          issue_date,
          revoked,
          ipfs_cid,
          hash,
          student_wallet,
          institution_wallet,
          metadata,
          institution:institutions (
            id,
            name,
            email
          ),
          student:users (
            id,
            name,
            email,
            wallet_address
          )
        `
        )
        .eq("certificate_id", parsedId)
        .maybeSingle();

      if (supabaseError || !data) {
        setError(supabaseError?.message ?? "Certificate not found.");
        setCertificate(null);
      } else {
        setCertificate(data as CertificateDetail);
      }

      setLoading(false);
    },
    [supabase]
  );

  const reset = useCallback(() => {
    setCertificate(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    certificate,
    loading,
    error,
    search,
    reset,
  };
}


