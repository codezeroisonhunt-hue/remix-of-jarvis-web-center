
import { Message } from "@/types/chat";

export interface ChatHistoryEntry {
  id: string;
  messages: Message[];
  date: Date;
  topic?: string;
}

// In-memory storage for chat history
const chatHistory: ChatHistoryEntry[] = [];
const MAX_HISTORY_ENTRIES = 50;

// Save a conversation to history
export const saveToHistory = (messages: Message[]): void => {
  if (messages.length <= 1) return; // Don't save empty conversations
  
  const userMessages = messages.filter(m => m.role === 'user');
  if (userMessages.length === 0) return;
  
  // Generate a topic from the first few user messages
  const topic = deriveTopicFromMessages(userMessages);
  
  const historyEntry: ChatHistoryEntry = {
    id: Date.now().toString(),
    messages: [...messages],
    date: new Date(),
    topic
  };
  
  chatHistory.unshift(historyEntry); // Add to beginning
  
  // Limit the history size
  if (chatHistory.length > MAX_HISTORY_ENTRIES) {
    chatHistory.pop();
  }
  
  // Optionally, persist to localStorage
  try {
    localStorage.setItem('jarvis_chat_history', JSON.stringify(
      chatHistory.map(entry => ({
        ...entry,
        date: entry.date.toISOString()
      }))
    ));
  } catch (error) {
    console.warn('Failed to save chat history to localStorage:', error);
  }
};

// Load chat history
export const loadChatHistory = (): ChatHistoryEntry[] => {
  try {
    const savedHistory = localStorage.getItem('jarvis_chat_history');
    if (!savedHistory) return [];
    
    return JSON.parse(savedHistory).map((entry: any) => ({
      ...entry,
      date: new Date(entry.date)
    }));
  } catch (error) {
    console.warn('Failed to load chat history from localStorage:', error);
    return [];
  }
};

// Initialize from localStorage if available
export const initializeChatHistory = (): void => {
  const savedHistory = loadChatHistory();
  if (savedHistory.length > 0) {
    chatHistory.push(...savedHistory);
  }
};

// Get recent conversations
export const getRecentConversations = (limit = 10): ChatHistoryEntry[] => {
  return chatHistory.slice(0, limit);
};

// Search through chat history
export const searchChatHistory = (query: string): ChatHistoryEntry[] => {
  query = query.toLowerCase();
  return chatHistory.filter(entry => 
    entry.topic?.toLowerCase().includes(query) || 
    entry.messages.some(m => m.content.toLowerCase().includes(query))
  );
};

// Get conversation by ID
export const getConversationById = (id: string): ChatHistoryEntry | undefined => {
  return chatHistory.find(entry => entry.id === id);
};

// Get messages from today
export const getTodaysConversations = (): ChatHistoryEntry[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return chatHistory.filter(entry => entry.date >= today);
};

// Process history-related queries
export const processHistoryQuery = (query: string): Message[] | null => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('past questions') || 
      lowerQuery.includes('chat history') || 
      lowerQuery.includes('previous conversations')) {
    
    const recent = getRecentConversations(5);
    
    if (recent.length === 0) {
      return [{
        id: 'history-empty',
        role: 'assistant',
        content: "I don't have any past conversations stored in my memory yet.",
        timestamp: new Date()
      }];
    }
    
    const content = `Here are your recent conversations:\n\n${
      recent.map((entry, index) => {
        const preview = entry.messages
          .filter(m => m.role === 'user')
          .slice(0, 1)
          .map(m => m.content.substring(0, 60) + (m.content.length > 60 ? '...' : ''))
          .join(', ');
        
        return `${index + 1}. ${entry.topic || preview} - ${formatRelativeTime(entry.date)}`;
      }).join('\n')
    }`;
    
    return [{
      id: 'history-response',
      role: 'assistant',
      content,
      timestamp: new Date(),
      data: recent,
      skillType: 'history'
    }];
  }
  
  if (lowerQuery.includes('asked earlier today') || 
      lowerQuery.includes('today\'s conversations')) {
    
    const todaysConvos = getTodaysConversations();
    
    if (todaysConvos.length === 0) {
      return [{
        id: 'history-today-empty',
        role: 'assistant',
        content: "We haven't had any conversations today yet.",
        timestamp: new Date()
      }];
    }
    
    const content = `Here's what you asked earlier today:\n\n${
      todaysConvos.map((entry, index) => {
        const preview = entry.messages
          .filter(m => m.role === 'user')
          .slice(0, 1)
          .map(m => m.content.substring(0, 60) + (m.content.length > 60 ? '...' : ''))
          .join(', ');
        
        const time = entry.date.toLocaleTimeString(undefined, { 
          hour: '2-digit', 
          minute: '2-digit'
        });
        
        return `${index + 1}. ${time}: ${preview}`;
      }).join('\n')
    }`;
    
    return [{
      id: 'history-today-response',
      role: 'assistant',
      content,
      timestamp: new Date(),
      data: todaysConvos,
      skillType: 'history'
    }];
  }
  
  // No matching history query
  return null;
};

// Helper function to generate a topic from messages
function deriveTopicFromMessages(messages: Message[]): string {
  if (messages.length === 0) return "Untitled Conversation";
  
  const firstFewWords = messages[0].content
    .split(' ')
    .slice(0, 4)
    .join(' ');
    
  return firstFewWords + (messages[0].content.length > firstFewWords.length ? "..." : "");
}

// Format relative time for display
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
}

// Initialize the chat history system
initializeChatHistory();
