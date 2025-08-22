import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qapnaciklgaahrdngwzh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcG5hY2lrbGdhYWhyZG5nd3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4Njc0NDgsImV4cCI6MjA3MTQ0MzQ0OH0.9VlM5HLhGgr1UwjqxjUEltzUQAX-8SEqKBH6leqpasY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };