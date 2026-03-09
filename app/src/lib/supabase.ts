import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// ** User Step Required **
// You must provide your Supabase URL and Anon Key here or in .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
