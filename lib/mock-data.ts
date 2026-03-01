export interface Account {
  id: string;
  name: string;
  currency: string;
  balance: number;
  accountNumber: string;
  routingNumber: string;
  type: "checking" | "savings";
  icon: string;
}

export interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: "completed" | "pending" | "failed";
  category: string;
  icon: string;
  type: "credit" | "debit";
}

export interface Card {
  id: string;
  name: string;
  last4: string;
  expiry: string;
  type: "visa" | "mastercard";
  frozen: boolean;
  balance: number;
  currency: string;
  color: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  avatar: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  currency: string;
  status: "paid" | "unpaid" | "overdue";
  dueDate: string;
  issuedDate: string;
  items: { description: string; quantity: number; price: number }[];
}

export const accounts: Account[] = [
  {
    id: "1",
    name: "US Dollar Account",
    currency: "USD",
    balance: 24850.75,
    accountNumber: "****4521",
    routingNumber: "021000021",
    type: "checking",
    icon: "flag",
  },
  {
    id: "2",
    name: "Canadian Dollar",
    currency: "CAD",
    balance: 15320.4,
    accountNumber: "****8734",
    routingNumber: "001002003",
    type: "checking",
    icon: "flag",
  },
  {
    id: "3",
    name: "Euro Account",
    currency: "EUR",
    balance: 8940.2,
    accountNumber: "****6192",
    routingNumber: "VENNEUR2X",
    type: "savings",
    icon: "flag",
  },
  {
    id: "4",
    name: "British Pound",
    currency: "GBP",
    balance: 5230.15,
    accountNumber: "****3847",
    routingNumber: "VENNGB2L",
    type: "savings",
    icon: "flag",
  },
];

export const transactions: Transaction[] = [
  {
    id: "1",
    title: "Shopify Inc.",
    description: "Monthly subscription",
    amount: -79.99,
    currency: "USD",
    date: "2026-02-22",
    status: "completed",
    category: "Software",
    icon: "shopping-bag",
    type: "debit",
  },
  {
    id: "2",
    title: "Client Payment",
    description: "Invoice #1042 - Web Development",
    amount: 4500.0,
    currency: "USD",
    date: "2026-02-21",
    status: "completed",
    category: "Income",
    icon: "arrow-down-left",
    type: "credit",
  },
  {
    id: "3",
    title: "AWS Services",
    description: "Cloud hosting fees",
    amount: -234.5,
    currency: "USD",
    date: "2026-02-20",
    status: "completed",
    category: "Infrastructure",
    icon: "cloud",
    type: "debit",
  },
  {
    id: "4",
    title: "Wire Transfer",
    description: "Transfer to CAD account",
    amount: -2000.0,
    currency: "USD",
    date: "2026-02-19",
    status: "pending",
    category: "Transfer",
    icon: "repeat",
    type: "debit",
  },
  {
    id: "5",
    title: "Figma Pro",
    description: "Design tool subscription",
    amount: -15.0,
    currency: "USD",
    date: "2026-02-18",
    status: "completed",
    category: "Software",
    icon: "pen-tool",
    type: "debit",
  },
  {
    id: "6",
    title: "Stripe Payout",
    description: "Weekly payout",
    amount: 3280.0,
    currency: "USD",
    date: "2026-02-17",
    status: "completed",
    category: "Income",
    icon: "arrow-down-left",
    type: "credit",
  },
  {
    id: "7",
    title: "Google Workspace",
    description: "Team plan",
    amount: -72.0,
    currency: "USD",
    date: "2026-02-16",
    status: "failed",
    category: "Software",
    icon: "mail",
    type: "debit",
  },
  {
    id: "8",
    title: "Interac e-Transfer",
    description: "From Alex Chen",
    amount: 850.0,
    currency: "CAD",
    date: "2026-02-15",
    status: "completed",
    category: "Income",
    icon: "arrow-down-left",
    type: "credit",
  },
  {
    id: "9",
    title: "Office Supplies",
    description: "Staples order",
    amount: -156.3,
    currency: "CAD",
    date: "2026-02-14",
    status: "completed",
    category: "Office",
    icon: "package",
    type: "debit",
  },
  {
    id: "10",
    title: "Consulting Fee",
    description: "Q1 Advisory services",
    amount: 7500.0,
    currency: "USD",
    date: "2026-02-13",
    status: "completed",
    category: "Income",
    icon: "arrow-down-left",
    type: "credit",
  },
  {
    id: "11",
    title: "Slack Technologies",
    description: "Business+ plan",
    amount: -12.5,
    currency: "USD",
    date: "2026-02-12",
    status: "completed",
    category: "Software",
    icon: "message-square",
    type: "debit",
  },
  {
    id: "12",
    title: "International Transfer",
    description: "EUR to GBP conversion",
    amount: -1500.0,
    currency: "EUR",
    date: "2026-02-11",
    status: "completed",
    category: "Transfer",
    icon: "repeat",
    type: "debit",
  },
];

export const cards: Card[] = [
  {
    id: "1",
    name: "Venn Business",
    last4: "4521",
    expiry: "09/28",
    type: "visa",
    frozen: false,
    balance: 24850.75,
    currency: "USD",
    color: "#00D09C",
  },
  {
    id: "2",
    name: "Venn Virtual",
    last4: "8392",
    expiry: "03/27",
    type: "mastercard",
    frozen: false,
    balance: 5000.0,
    currency: "USD",
    color: "#4C7CFF",
  },
  {
    id: "3",
    name: "Venn Travel",
    last4: "6710",
    expiry: "12/27",
    type: "visa",
    frozen: true,
    balance: 1250.0,
    currency: "CAD",
    color: "#FF6B8A",
  },
];

export const beneficiaries: Beneficiary[] = [
  {
    id: "1",
    name: "Saud Aziz",
    bank: "TD Bank",
    accountNumber: "****5621",
    avatar: "SA",
  },
  {
    id: "2",
    name: "Ahmed Shafik",
    bank: "RBC Royal",
    accountNumber: "****8843",
    avatar: "AS",
  },
  {
    id: "3",
    name: "Anton Riabov",
    bank: "Chase",
    accountNumber: "****2290",
    avatar: "AR",
  },
  {
    id: "4",
    name: "Saheel Bhatt",
    bank: "BBVA",
    accountNumber: "****7715",
    avatar: "SB",
  },
  {
    id: "5",
    name: "Conor O'Hanlon",
    bank: "Scotiabank",
    accountNumber: "****3302",
    avatar: "CO",
  },
];

export const invoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-1042",
    client: "Acme Corp",
    amount: 4500.0,
    currency: "USD",
    status: "paid",
    dueDate: "2026-02-15",
    issuedDate: "2026-01-15",
    items: [
      { description: "Web Development", quantity: 1, price: 3500 },
      { description: "UI Design", quantity: 1, price: 1000 },
    ],
  },
  {
    id: "2",
    invoiceNumber: "INV-1043",
    client: "TechStart Inc.",
    amount: 2800.0,
    currency: "USD",
    status: "unpaid",
    dueDate: "2026-03-01",
    issuedDate: "2026-02-01",
    items: [{ description: "Consulting - 40hrs", quantity: 40, price: 70 }],
  },
  {
    id: "3",
    invoiceNumber: "INV-1044",
    client: "GlobalTrade Ltd.",
    amount: 6200.0,
    currency: "CAD",
    status: "overdue",
    dueDate: "2026-02-10",
    issuedDate: "2026-01-10",
    items: [
      { description: "API Integration", quantity: 1, price: 4200 },
      { description: "Testing & QA", quantity: 1, price: 2000 },
    ],
  },
  {
    id: "4",
    invoiceNumber: "INV-1045",
    client: "DesignHub",
    amount: 1500.0,
    currency: "USD",
    status: "paid",
    dueDate: "2026-02-20",
    issuedDate: "2026-01-20",
    items: [{ description: "Brand Design Package", quantity: 1, price: 1500 }],
  },
  {
    id: "5",
    invoiceNumber: "INV-1046",
    client: "CloudSync",
    amount: 3750.0,
    currency: "EUR",
    status: "unpaid",
    dueDate: "2026-03-15",
    issuedDate: "2026-02-15",
    items: [
      { description: "Infrastructure Setup", quantity: 1, price: 2750 },
      { description: "Documentation", quantity: 1, price: 1000 },
    ],
  },
];

export const cashflowData = {
  income: 16130.0,
  expenses: 8569.29,
  net: 7560.71,
  monthlyData: [
    { month: "Sep", income: 12400, expenses: 7200 },
    { month: "Oct", income: 14800, expenses: 8100 },
    { month: "Nov", income: 11200, expenses: 6900 },
    { month: "Dec", income: 18500, expenses: 9200 },
    { month: "Jan", income: 15300, expenses: 7800 },
    { month: "Feb", income: 16130, expenses: 8569 },
  ],
};

export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  const symbols: Record<string, string> = {
    USD: "$",
    CAD: "C$",
    EUR: "\u20AC",
    GBP: "\u00A3",
  };
  const symbol = symbols[currency] || "$";
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount < 0 ? "-" : ""}${symbol}${formatted}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
