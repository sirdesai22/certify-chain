# 🎓 CertifyChain – Blockchain-Based Academic Credential Verification

CertifyChain is a **decentralized certificate verification platform** built using **Next.js, Solidity, and IPFS**.  
It enables universities to issue tamper-proof certificates, students to securely store and share them,  
and employers to instantly verify authenticity — all without intermediaries.

---

## 🚀 Overview

### 🔍 Problem
Academic credential fraud costs **$4 billion annually**. Traditional verification takes **weeks**, requiring  
manual checks and paperwork. Universities and employers face inefficiency, and students lack control.

### 💡 Solution
CertifyChain solves this by:
- Storing **certificate hashes on Ethereum blockchain**
- Saving **certificate files on IPFS**
- Providing **real-time global verification**
- Allowing users to verify certificates using **QR codes or certificate IDs**

---

## 🧠 System Architecture

```plaintext
 ┌───────────────────────────────────────────┐
 │                Client UI (Next.js)        │
 │   - Login / Wallet Auth                   │
 │   - Issue / View / Verify Certificates    │
 │   - QR Scanner for Verification           │
 └───────────────────▲───────────────────────┘
                     │
                     │ ethers.js (Web3)
                     │
        ┌────────────┴─────────────┐
        │      Smart Contracts     │
        │         (Solidity)       │
        │ - Register institutions  │
        │ - Issue / Revoke certs   │
        │ - Verify authenticity    │
        └────────────▲─────────────┘
                     │
                     │ Certificate Hash
                     │
      ┌──────────────┴────────────────┐
      │          IPFS (Filecoin)      │
      │ - Store certificate PDFs      │
      │ - Return IPFS CID             │
      └──────────────▲────────────────┘
                     │
                     │ Meta / Logs / Profiles
                     │
        ┌────────────┴─────────────┐
        │       Supabase DB        │
        │ - Users & institutions   │
        │ - Metadata + analytics   │
        │ - Verification logs      │
        └──────────────────────────┘
````

---

## ⚙️ Tech Stack

| Layer            | Technology                           |
| ---------------- | ------------------------------------ |
| Frontend         | **Next.js**, **Tailwind CSS**        |
| Smart Contracts  | **Solidity**, **Hardhat**            |
| Web3 Integration | **Ethers.js**, **MetaMask**          |
| Storage          | **IPFS (Filecoin)**                  |
| Database         | **Supabase (PostgreSQL)**            |
| Auth             | **Supabase Auth / Wallet Connect**   |
| PDF Handling     | **pdf-viewer**, **qrcode-generator** |

---

## 🧩 Core Modules

| Module              | Description                         |
| ------------------- | ----------------------------------- |
| **Institution**     | Issue & revoke certificates         |
| **Student**         | View, download & share certificates |
| **Employer**        | Verify authenticity instantly       |
| **Admin**           | Approve institutions, manage logs   |
| **Smart Contracts** | Immutable certificate registry      |
| **IPFS**            | Stores actual PDF files             |
| **Supabase**        | Stores metadata & analytics         |

---

## 🧱 Smart Contract Design

### `CertifyRegistry.sol`

* `registerInstitution(address)`
* `removeInstitution(address)`
* `isInstitution(address)`

### `Certificate.sol`

* `issueCertificate(address student, string cid, string hash)`
* `revokeCertificate(uint256 certId)`
* `getCertificate(uint256 certId)`

#### On-chain stored data:

```solidity
struct Certificate {
    uint256 certificateId;
    address studentWallet;
    address institutionWallet;
    string ipfsCid;
    string hash;
    uint256 issueDate;
    bool revoked;
}
```

---

## 🌐 Application Pages (Next.js)

### Public Routes

| Route     | Purpose              |
| --------- | -------------------- |
| `/`       | Landing Page         |
| `/login`  | Wallet / Email login |
| `/verify` | Verify by ID or QR   |
| `/scan`   | QR Scanner           |

### Student Routes

| Route                        | Purpose               |
| ---------------------------- | --------------------- |
| `/student`                   | Dashboard             |
| `/student/certificates`      | View all certificates |
| `/student/certificates/[id]` | Certificate detail    |
| `/student/profile`           | Edit profile          |

### Institution Routes

| Route                       | Purpose                    |
| --------------------------- | -------------------------- |
| `/institution`              | Overview dashboard         |
| `/institution/issue`        | Upload + issue certificate |
| `/institution/certificates` | Manage all certificates    |
| `/institution/students`     | Manage recipients          |
| `/institution/profile`      | Institution profile        |

### Employer Routes

| Route                         | Purpose          |
| ----------------------------- | ---------------- |
| `/employer/verify`            | Verify via ID    |
| `/employer/scan`              | Scan QR          |
| `/employer/certificates/[id]` | View certificate |

### Admin Routes

| Route                 | Purpose                |
| --------------------- | ---------------------- |
| `/admin`              | Dashboard              |
| `/admin/institutions` | Approve institutions   |
| `/admin/logs`         | System logs            |
| `/admin/analytics`    | Verification analytics |

---

## 🗄️ Database (Supabase)

### `users`

| Field          | Type                                        |
| -------------- | ------------------------------------------- |
| id             | UUID                                        |
| wallet_address | String                                      |
| role           | Enum(student, institution, employer, admin) |
| name           | String                                      |
| email          | String                                      |
| createdAt      | Timestamp                                   |

### `certificates_meta`

| Field             | Type      |
| ----------------- | --------- |
| certificateId     | Int       |
| studentWallet     | String    |
| institutionWallet | String    |
| ipfsCid           | String    |
| hash              | String    |
| title             | String    |
| issueDate         | Timestamp |
| revoked           | Boolean   |

### `verification_logs`

| Field         | Type      |
| ------------- | --------- |
| logId         | UUID      |
| certificateId | Int       |
| verifiedBy    | String    |
| timestamp     | Timestamp |
| success       | Boolean   |

---

## 🔄 Certificate Lifecycle

### 1️⃣ Issue

1. Institution uploads PDF → stored on IPFS → returns CID
2. Generate hash → `issueCertificate()` called on smart contract
3. Metadata saved in Supabase
4. Student can view certificate in dashboard

### 2️⃣ Verify

1. Employer enters ID / scans QR
2. Fetch CID + hash from blockchain
3. Retrieve file from IPFS
4. Recalculate hash → if matches ✅ verified

---

## 🧩 Reusable Components

| Component       | Function                       |
| --------------- | ------------------------------ |
| `WalletConnect` | Connect Metamask               |
| `CertCard`      | Display certificate summary    |
| `QRGenerator`   | Generate shareable QR          |
| `FileUploader`  | Upload certificate PDFs        |
| `PDFViewer`     | Display certificate in browser |
| `Modal`         | Revoke / approve certificates  |
| `Table`         | Generic table UI               |

---

## 📂 Directory Structure

```bash
/app
  /admin
  /student
  /institution
  /employer
  /verify
  /scan
/components
/contracts
/hooks
/lib
/styles
/utils
```

---

## 🧩 Data Flow Summary

```plaintext
Institution issues certificate
   ↓
PDF → IPFS (returns CID)
   ↓
Hash generated
   ↓
Smart contract stores (CID + hash)
   ↓
Metadata saved in Supabase
   ↓
Student views → Employer verifies (CID + hash)
```

✅ Verifies authenticity
✅ Removes intermediaries
✅ Prevents tampering

---

## ⚡ Future Enhancements

* Integrate **Layer-2 scaling (Polygon / Arbitrum)**
* Add **ZK Proofs for private verification**
* Implement **Institution KYC verification**
* Add **Email notification system**
* Include **Dark mode dashboard UI**

---

## 🧩 Project Goals

* Eliminate fake certificates using blockchain
* Enable instant verification globally
* Ensure GDPR-compliant data handling
* Simplify issuance and verification workflows

---

## 🏁 Conclusion

CertifyChain provides a **trustless, globally accessible, tamper-proof academic verification ecosystem**.
It modernizes credential verification through decentralized, transparent technology, aligning with the
future of digital identity and education.
