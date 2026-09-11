export type PaymentStatus = "Paid" | "Pending" | "Failed";
export type MaintenanceStatus =
  | "Submitted"
  | "Reviewed"
  | "Assigned"
  | "In Progress"
  | "Completed"
  | "Closed";

export const tenantHome = {
  property: "The Curve Residence",
  unit: "A-204",
  floor: "2nd Floor",
  doorNumber: "A-204",
  address: "Kilimani, Nairobi",
  monthlyRent: 25000,
  balance: 25000,
  dueLabel: "Due 5 October 2026",
  leaseEnds: "31 August 2027",
  agent: "Grace Wanjiku",
};

export const tenantPayments = [
  { id: "p-003", date: "05 Sep 2026", description: "September rent", amount: 25000, method: "M-Pesa", status: "Paid" as PaymentStatus, receipt: "BH-0926-1042" },
  { id: "p-002", date: "05 Aug 2026", description: "August rent", amount: 25000, method: "M-Pesa", status: "Paid" as PaymentStatus, receipt: "BH-0826-0981" },
  { id: "p-001", date: "05 Jul 2026", description: "July rent", amount: 25000, method: "Bank", status: "Paid" as PaymentStatus, receipt: "BH-0726-0874" },
];

export const maintenanceRequests = [
  { id: "m-002", title: "Kitchen tap leaking", category: "Plumbing", date: "09 Sep 2026", status: "In Progress" as MaintenanceStatus, priority: "Medium", update: "Technician expected today, 2–4 PM" },
  { id: "m-001", title: "Bedroom socket", category: "Electrical", date: "21 Aug 2026", status: "Completed" as MaintenanceStatus, priority: "High", update: "Completed on 23 Aug 2026" },
];

export const tenantDocuments = [
  { id: "d-001", title: "Lease agreement", detail: "01 Sep 2026 – 31 Aug 2027", type: "Lease", size: "1.8 MB" },
  { id: "d-002", title: "Move-in inspection", detail: "Signed 01 Sep 2026", type: "Inspection", size: "2.4 MB" },
  { id: "d-003", title: "Security deposit receipt", detail: "Paid 28 Aug 2026", type: "Receipt", size: "420 KB" },
];

export const announcements = [
  { id: "a-001", title: "Water maintenance", body: "Water will be unavailable Saturday from 10:00 AM to 2:00 PM.", time: "Today" },
  { id: "a-002", title: "October rent reminder", body: "Your next rent payment is due on 5 October.", time: "Yesterday" },
];

export const agentOverview = {
  expected: 850000,
  collected: 790000,
  outstanding: 60000,
  occupancy: 92,
  tenants: 43,
  openMaintenance: 6,
};

export const ownerOverview = {
  expected: 850000,
  collected: 790000,
  expenses: 85000,
  managementFee: 35000,
  payout: 670000,
  occupancy: 89.6,
};
