// supabase.js

const supabaseUrl = 'https://emqigcovjkfupxnjakss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcWlnY292amtmdXB4bmpha3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTE1MTEsImV4cCI6MjA2MjM2NzUxMX0.3Kh8C02mEgRRrp52l8JKRYmViFyPDP-Lzr-40WEq-FQ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function logToSupabase(command, action, url = null, mood = "neutral") {
  const { error } = await supabase.from("jarvis_logs").insert([
    {
      user_id: "larry150",
      command: command,
      action: action,
      resource_url: url,
      mood: mood
    }
  ]);

  if (error) {
    console.error("Supabase log error:", error);
  } else {
    console.log("Supabase log successful.");
  }
}
