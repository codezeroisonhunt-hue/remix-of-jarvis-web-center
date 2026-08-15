
// Mock Supabase logger for development purposes
export const logToSupabase = async (command: string, action: string, videoUrl: string, mood: string) => {
  console.log("Supabase log:", { command, action, videoUrl, mood });
  return true;
};
