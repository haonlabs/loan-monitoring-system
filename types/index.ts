export type LoanStatus = "active" | "paid" | "overdue";

export interface Borrower {
  id: string;
  name: string;
  phone: string;
  shareToken: string;
  verifyCode: string;
  tags: string[];
  isActive: boolean;
  notes: string;
  createdAt: Date;
}

export interface Loan {
  id: string;
  borrowerId: string;
  principal: number;
  interest: number;
  totalAmount: number;
  remainingAmount: number;
  startDate: Date;
  dueDate: Date | null;
  status: LoanStatus;
  description: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  paidAt: Date;
  note: string;
  remainingAfter: number;
  recordedBy: string;
}

export type ProofUploaderRole = "borrower" | "lender";

export interface TransferProof {
  id: string;
  loanId: string;
  originalName: string;
  contentType: string;
  size: number;
  blobPathname?: string;
  caption: string;
  uploaderRole: ProofUploaderRole;
  uploadedAt: Date;
}

export interface BorrowerWithLoans extends Borrower { loans: Loan[]; payments: Payment[]; proofs: TransferProof[] }

export interface DashboardSummary {
  totalReceivable: number;
  totalBorrowers: number;
  activeBorrowers: number;
  paidBorrowers: number;
  overdueBorrowers: number;
}
