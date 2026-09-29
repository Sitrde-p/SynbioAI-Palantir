/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string =
  (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseKey: string =
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

