export type TransactionType = "income" | "expense";

export interface Profile {
  id: string;
  email: string;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  type: TransactionType;
  is_default: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string | null;
  type: TransactionType;
  amount: number;
  description: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  // Relasi JOIN dari Supabase
  accounts?: {
    name: string;
  } | null;
  categories?: {
    name: string;
    type: TransactionType;
  } | null;
}