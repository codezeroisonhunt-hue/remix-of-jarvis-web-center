/**
 * Task Management Service
 * Extracts tasks from natural language and manages them
 */

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
  completed: boolean;
  tags?: string[];
  extractedFrom?: string;
}

// Regular expressions for identifying task-related content
const taskPatterns = [
  // Pattern for "remind me to X" or "remember to X"
  /(?:remind me to|remember to) (.+?)(?:by|on|at|tomorrow|today|tonight|this evening|next week|$)/i,
  
  // Pattern for "I need to X" or "I have to X"
  /(?:i need to|i have to|i must) (.+?)(?:by|on|at|tomorrow|today|tonight|this evening|next week|$)/i,
  
  // Pattern for "add task: X" or "new task: X"
  /(?:add task:|new task:|create task:|add a task:) (.+)/i,
  
  // Pattern for detecting tasks with explicit due dates
  /(.+) by (tomorrow|today|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i
];

// Simple date regex patterns
const datePatterns = {
  today: /today|tonight|this evening/i,
  tomorrow: /tomorrow/i,
  nextWeek: /next week/i,
  specificDay: /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i
};

// Priority keywords
const priorityPatterns = {
  high: /urgent|important|critical|high priority|asap|right away/i,
  medium: /medium priority|moderate priority/i,
  low: /low priority|when you can|if you have time/i
};

/**
 * Parse a task from natural language text
 * @param text User input text
 * @returns Task object if a task was detected, null otherwise
 */
export const parseTaskFromText = (text: string): Task | null => {
  if (!text || text.trim().length === 0) {
    return null;
  }
  
  let taskTitle = '';
  let taskDueDate: string | undefined;
  let taskPriority: 'high' | 'medium' | 'low' | undefined;
  
  // Extract task title from patterns
  for (const pattern of taskPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      taskTitle = match[1].trim();
      break;
    }
  }
  
  // If no task title was extracted, this probably isn't a task
  if (!taskTitle) {
    return null;
  }
  
  // Extract due date if present
  if (datePatterns.today.test(text)) {
    const today = new Date();
    taskDueDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  } else if (datePatterns.tomorrow.test(text)) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    taskDueDate = tomorrow.toISOString().split('T')[0];
  } else if (datePatterns.nextWeek.test(text)) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    taskDueDate = nextWeek.toISOString().split('T')[0];
  } else {
    // Check for specific day of week
    const dayMatch = text.match(datePatterns.specificDay);
    if (dayMatch && dayMatch[1]) {
      const today = new Date();
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = daysOfWeek.indexOf(dayMatch[1].toLowerCase());
      if (targetDay !== -1) {
        const currentDay = today.getDay();
        const daysToAdd = (targetDay - currentDay + 7) % 7 || 7; // If today, add 7 days
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + daysToAdd);
        taskDueDate = targetDate.toISOString().split('T')[0];
      }
    }
  }
  
  // Extract priority if present
  if (priorityPatterns.high.test(text)) {
    taskPriority = 'high';
  } else if (priorityPatterns.medium.test(text)) {
    taskPriority = 'medium';
  } else if (priorityPatterns.low.test(text)) {
    taskPriority = 'low';
  }
  
  // Extract potential tags (words with # prefix)
  const tagMatches = text.match(/#\w+/g);
  const tags = tagMatches ? tagMatches.map(tag => tag.substring(1)) : undefined;
  
  return {
    id: Date.now().toString(),
    title: taskTitle,
    dueDate: taskDueDate,
    priority: taskPriority,
    completed: false,
    tags,
    extractedFrom: text
  };
};

/**
 * This service would normally connect to a backend to store and retrieve tasks.
 * For now, we'll use localStorage for persistence.
 */

// Load tasks from local storage
export const loadTasks = (): Task[] => {
  try {
    const tasksJson = localStorage.getItem('jarvis_tasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

// Save tasks to local storage
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem('jarvis_tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

// Add a new task
export const addTask = (task: Task): Task[] => {
  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);
  return tasks;
};

// Update a task
export const updateTask = (taskId: string, updates: Partial<Task>): Task[] => {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    saveTasks(tasks);
  }
  
  return tasks;
};

// Delete a task
export const deleteTask = (taskId: string): Task[] => {
  let tasks = loadTasks();
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasks(tasks);
  return tasks;
};

// Get all tasks (needed for TaskList.tsx)
export const getTasks = (): Task[] => {
  return loadTasks();
};

// Add a task from text
export const addTask2 = (taskTitle: string): Task => {
  const newTask: Task = {
    id: Date.now().toString(),
    title: taskTitle,
    completed: false,
    priority: 'medium'
  };
  
  addTask(newTask);
  return newTask;
};

// Remove a task (needed for TaskList.tsx)
export const removeTask = (taskId: string): void => {
  deleteTask(taskId);
};
