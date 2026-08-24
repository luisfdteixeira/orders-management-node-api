import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY as string;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseClient: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey,
  {
    db: {
      schema: 'empresa-teste-1',
    },
  }
);