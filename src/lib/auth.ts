// Authentication library stub
// TODO: Implement full authentication with Supabase

export function isSupabaseConfigured(): boolean {
  return false; // Not configured yet
}

export async function getCurrentUser() {
  return null; // No user when not configured
}

export function onAuthStateChange(callback: (user: any) => void) {
  // No-op when not configured
  return () => {}; // Return cleanup function
}
