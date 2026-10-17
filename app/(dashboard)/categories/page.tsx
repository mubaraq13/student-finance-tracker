import { createClient } from "@/lib/supabase/server";
import CategoryManager from "@/components/categories/CategoryManager";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });

  return <CategoryManager categories={categories || []} />;
}