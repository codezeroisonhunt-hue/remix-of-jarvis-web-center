// services/offlineAIService.ts

export function getOfflineJarvisResponse(userMessage: string): string {
  const input = userMessage.toLowerCase();

  let memoryReply = learnFact(input);
  if (memoryReply) return memoryReply;

  if (input.includes("time")) {
    return "Current time is " + new Date().toLocaleTimeString();
  } else if (input.includes("date")) {
    return "Today's date is " + new Date().toLocaleDateString();
  } else if (input.includes("joke")) {
    const jokes = [
      "Debugging is like being the detective in a crime movie where you are also the murderer.",
      "Why do programmers prefer dark mode? Because light attracts bugs."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  } else if (input.includes("your name") || input.includes("who are you")) {
    return "I’m Jarvis, your offline intelligent assistant.";
  } else {
    return "I'm still learning. Try again differently.";
  }
}

function learnFact(message: string): string | null {
  if (message.startsWith("remember")) {
    const fact = message.replace("remember", "").trim();
    let facts = JSON.parse(localStorage.getItem("facts") || "[]");
    facts.push(fact);
    localStorage.setItem("facts", JSON.stringify(facts));
    return "Got it. I’ll remember that.";
  }

  if (message.includes("what do you remember")) {
    let facts = JSON.parse(localStorage.getItem("facts") || "[]");
    return "Here's what I remember: " + (facts.length ? facts.join(", ") : "nothing yet.");
  }

  return null;
}
