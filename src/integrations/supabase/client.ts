// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vhyghnawrfjoosgrmsyw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoeWdobmF3cmZqb29zZ3Jtc3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODA0NzgsImV4cCI6MjA1Njg1NjQ3OH0.BibbDZ6WrWvYfR0ok94QXnwUFfjXtxT4s0xmWFyCX4A";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);