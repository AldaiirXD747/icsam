
import { supabase } from "@/integrations/supabase/client";
import { migrateDataToSupabase } from "@/utils/dataMigration"; 

// Re-export the main migration function for backward compatibility
export { migrateDataToSupabase };
