import { createClient } from "@/lib/supabase/server";
import ReportDashboard from "@/components/reports/ReportDashboard";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      accounts ( name ),
      categories ( name, type )
    `)
    .order("transaction_date", { ascending: false });

  return <ReportDashboard transactions={transactions || []} />;
}