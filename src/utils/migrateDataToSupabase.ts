
import { supabase } from "@/integrations/supabase/client";
import { cleanMatchesOnly, migrateDataToSupabase as migrate } from "@/utils/dataMigration";

// Re-export the function for compatibility
export const migrateDataToSupabase = migrate;

export default migrateDataToSupabase;
