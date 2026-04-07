export interface Application {
  id: string;
  applicantName: string;
  aadhaarLast4: string;
  scheme: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  appliedDate: string;
  district: string;
  flagReason?: string;
  bankLast4?: string;
}

export interface FraudCase {
  id: string;
  applicationId: string;
  applicantName: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  assignedTo?: string;
  detectedDate: string;
  notes?: string[];
}

export const mockApplications: Application[] = [
  {
    id: "APP-2024-001",
    applicantName: "Rajesh Kumar",
    aadhaarLast4: "4532",
    scheme: "PM Kisan Samman Nidhi",
    amount: 6000,
    status: "approved",
    appliedDate: "2024-01-15",
    district: "Lucknow",
    bankLast4: "7890",
  },
  {
    id: "APP-2024-002",
    applicantName: "Sunita Devi",
    aadhaarLast4: "8721",
    scheme: "Ujjwala Yojana",
    amount: 3200,
    status: "pending",
    appliedDate: "2024-01-18",
    district: "Varanasi",
    bankLast4: "4521",
  },
  {
    id: "APP-2024-003",
    applicantName: "Mohammad Ali",
    aadhaarLast4: "3456",
    scheme: "PMAY - Housing",
    amount: 250000,
    status: "flagged",
    appliedDate: "2024-01-10",
    district: "Kanpur",
    flagReason: "Duplicate Aadhaar detected in another district",
    bankLast4: "1234",
  },
  {
    id: "APP-2024-004",
    applicantName: "Priya Sharma",
    aadhaarLast4: "9876",
    scheme: "PM Kisan Samman Nidhi",
    amount: 6000,
    status: "approved",
    appliedDate: "2024-01-12",
    district: "Agra",
    bankLast4: "5678",
  },
  {
    id: "APP-2024-005",
    applicantName: "Vikram Singh",
    aadhaarLast4: "1122",
    scheme: "Ayushman Bharat",
    amount: 50000,
    status: "rejected",
    appliedDate: "2024-01-08",
    district: "Jaipur",
    bankLast4: "3344",
  },
  {
    id: "APP-2024-006",
    applicantName: "Geeta Patel",
    aadhaarLast4: "5566",
    scheme: "PMAY - Housing",
    amount: 250000,
    status: "flagged",
    appliedDate: "2024-01-20",
    district: "Ahmedabad",
    flagReason: "Same bank account used in multiple applications",
    bankLast4: "1234",
  },
  {
    id: "APP-2024-007",
    applicantName: "Arun Mehta",
    aadhaarLast4: "7788",
    scheme: "Ujjwala Yojana",
    amount: 3200,
    status: "pending",
    appliedDate: "2024-01-22",
    district: "Bhopal",
    bankLast4: "9900",
  },
  {
    id: "APP-2024-008",
    applicantName: "Lakshmi Nair",
    aadhaarLast4: "2233",
    scheme: "PM Kisan Samman Nidhi",
    amount: 6000,
    status: "approved",
    appliedDate: "2024-01-14",
    district: "Kochi",
    bankLast4: "4455",
  },
];

export const mockFraudCases: FraudCase[] = [
  {
    id: "CASE-001",
    applicationId: "APP-2024-003",
    applicantName: "Mohammad Ali",
    reason: "Duplicate Aadhaar detected in Varanasi district",
    severity: "high",
    status: "open",
    detectedDate: "2024-01-11",
    notes: ["Initial detection via automated system", "Cross-referencing with Varanasi records"],
  },
  {
    id: "CASE-002",
    applicationId: "APP-2024-006",
    applicantName: "Geeta Patel",
    reason: "Same bank account linked to 3 different Aadhaar numbers",
    severity: "high",
    status: "investigating",
    assignedTo: "Investigator Sharma",
    detectedDate: "2024-01-21",
    notes: ["Bank records requested", "Family members verification pending"],
  },
  {
    id: "CASE-003",
    applicationId: "APP-2024-009",
    applicantName: "Ramesh Verma",
    reason: "Multiple applications from same device ID",
    severity: "medium",
    status: "open",
    detectedDate: "2024-01-19",
  },
  {
    id: "CASE-004",
    applicationId: "APP-2024-010",
    applicantName: "Anita Kumari",
    reason: "Income certificate mismatch with ITR records",
    severity: "low",
    status: "resolved",
    assignedTo: "Investigator Verma",
    detectedDate: "2024-01-05",
    notes: ["Verified with Income Tax department", "Found to be clerical error", "Case closed - legitimate application"],
  },
];

export const schemes = [
  { id: "kisan", name: "PM Kisan Samman Nidhi", amount: 6000 },
  { id: "ujjwala", name: "Ujjwala Yojana", amount: 3200 },
  { id: "pmay", name: "PMAY - Pradhan Mantri Awas Yojana", amount: 250000 },
  { id: "ayushman", name: "Ayushman Bharat", amount: 50000 },
  { id: "mudra", name: "PM MUDRA Yojana", amount: 1000000 },
];

export const districtFraudData = [
  { district: "Lucknow", cases: 12, amount: 450000 },
  { district: "Kanpur", cases: 8, amount: 320000 },
  { district: "Varanasi", cases: 15, amount: 580000 },
  { district: "Agra", cases: 6, amount: 210000 },
  { district: "Jaipur", cases: 10, amount: 390000 },
  { district: "Ahmedabad", cases: 7, amount: 275000 },
];

export const monthlyStats = [
  { month: "Jan", applications: 1250, approved: 980, flagged: 45 },
  { month: "Feb", applications: 1420, approved: 1100, flagged: 62 },
  { month: "Mar", applications: 1680, approved: 1350, flagged: 55 },
  { month: "Apr", applications: 1520, approved: 1200, flagged: 48 },
  { month: "May", applications: 1890, approved: 1520, flagged: 71 },
  { month: "Jun", applications: 2100, approved: 1750, flagged: 85 },
];
