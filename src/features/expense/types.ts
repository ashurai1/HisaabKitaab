// Types for the Expense Management App

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  members: User[];
  color: string;
  icon: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  category: string;
  paidBy: string;
  date: string;
  splitBetween: string[];
  notes?: string;
  receipt?: string;
}

export type ExpenseCategory = 
  | "food" 
  | "transport" 
  | "entertainment" 
  | "shopping" 
  | "utilities" 
  | "rent" 
  | "travel" 
  | "medical" 
  | "other";

export const EXPENSE_CATEGORIES: Array<{value: ExpenseCategory; label: string; icon: string}> = [
  { value: "food", label: "Food & Dining", icon: "utensils" },
  { value: "transport", label: "Transport", icon: "car" },
  { value: "entertainment", label: "Entertainment", icon: "film" },
  { value: "shopping", label: "Shopping", icon: "shopping-bag" },
  { value: "utilities", label: "Utilities", icon: "zap" },
  { value: "rent", label: "Rent", icon: "home" },
  { value: "travel", label: "Travel", icon: "map" },
  { value: "medical", label: "Medical", icon: "activity" },
  { value: "other", label: "Other", icon: "more-horizontal" }
];

export const GROUP_ICONS = [
  "users",
  "home",
  "briefcase",
  "coffee",
  "heart",
  "plane",
  "car",
  "shopping-bag",
  "utensils"
];

export const GROUP_COLORS = [
  "blue", 
  "green",
  "violet",
  "orange",
  "pink",
  "teal",
  "red",
  "yellow",
  "indigo"
];