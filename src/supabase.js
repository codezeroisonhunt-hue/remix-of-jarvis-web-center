
// Mock Supabase logger for development purposes
export const logToSupabase = async (command, action, videoUrl, mood) => {
  console.log("Supabase log:", { command, action, videoUrl, mood });
  return true;
};
