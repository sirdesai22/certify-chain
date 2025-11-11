"use client";

export type UserRole = "student" | "institution" | "employer" | "admin";

export type UserRecord = {
  id: string;
  wallet_address: string | null;
  role: UserRole;
  name: string;
  email: string | null;
  institute_id: string | null;
  created_at: string;
  onboarding_completed: boolean;
};

export type InstitutionRecord = {
  id: string;
  name: string;
  email: string | null;
  address: string | null;
  website: string | null;
  approved: boolean;
  created_at: string;
};

export type CertificateMeta = {
  certificate_id: number;
  student_id: string;
  institution_id: string;
  student_wallet: string;
  institution_wallet: string;
  ipfs_cid: string;
  hash: string;
  title: string;
  description: string | null;
  issue_date: string;
  revoked: boolean;
  metadata: Record<string, unknown> | null;
};

export type CertificateWithRelations = CertificateMeta & {
  student?: UserRecord | null;
  institution?: InstitutionRecord | null;
};

export type VerificationLogRecord = {
  log_id: string;
  certificate_id: number;
  verified_by: string | null;
  method: string | null;
  success: boolean;
  notes: string | null;
  created_at: string;
};

export type AnalyticsMetrics = {
  issuedCertificates: number;
  activeInstitutions: number;
  verificationsThisMonth: number;
  revokedCertificates: number;
};


