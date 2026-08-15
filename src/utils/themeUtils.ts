
// Simple utility to detect dark mode setting
export const isDarkMode = (): boolean => {
  // Check if window exists (for SSR)
  if (typeof window === 'undefined') return true;
  
  // Check for user preference
  if (localStorage.getItem('theme') === 'dark') return true;
  if (localStorage.getItem('theme') === 'light') return false;
  
  // Check for system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Get greeting based on time of day
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

// Generate nickname based mode
export const getNickname = (useNickname: boolean = false, nickname: string = ''): string => {
  if (!useNickname) return '';
  
  return nickname || 'Sir';
};

// Format time for display
export const formatTimeForDisplay = (): string => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
