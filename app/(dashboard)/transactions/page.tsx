import { createClient } from "@/lib/supabase/server";
import TransactionManager from "@/components/transactions/TransactionManager";

export default async function TransactionsPage() {
  const supabase = await createClient();

  const [transactionsRes, accountsRes, categoriesRes] = await Promise.all([
    supabase
      .from("transactions")
      .select(`
        *,
        accounts ( name ),
        categories ( name, type )
      `)
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("accounts").select("*").order("name", { ascending: true }),
    supabase
      .from("categories")
      .select("*")
      .order("is_default", { ascending: false })
      .order("name", { ascending: true }),
  ]);

  return (
    <TransactionManager
      initialTransactions={transactionsRes.data || []}
      accounts={accountsRes.data || []}
      categories={categoriesRes.data || []}
    />
  );
}