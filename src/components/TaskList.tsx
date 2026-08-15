
import React, { useState } from 'react';
import { Check, Clock, Edit, Plus, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getTasks, addTask, updateTask, removeTask, Task } from '@/services/taskManagementService';

interface TaskListProps {
  isHackerMode?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ isHackerMode = false }) => {
  const [tasks, setTasks] = useState<Task[]>(getTasks());
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    
    // Create a new task directly instead of using addTask(string)
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskText,
      completed: false,
      priority: 'medium'
    };
    
    const updatedTasks = addTask(newTask);
    setTasks(updatedTasks);
    setNewTaskText('');
  };

  const handleUpdateTask = (taskId: string, completed: boolean) => {
    const updatedTasks = updateTask(taskId, { completed });
    setTasks(updatedTasks);
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setEditingTaskId(taskId);
    setEditText(task.title); // Changed from task.text to task.title
  };

  const handleSaveEdit = (taskId: string) => {
    if (!editText.trim()) return;
    
    const updatedTasks = updateTask(taskId, { title: editText }); // Changed from text to title
    setTasks(updatedTasks);
    setEditingTaskId(null);
    setEditText('');
  };

  const handleDeleteTask = (taskId: string) => {
    removeTask(taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className={`flex-1 ${isHackerMode ? 'bg-black text-white border-red-500/30' : 'bg-black/30 text-white border-jarvis/30'}`}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <Button 
          onClick={handleAddTask}
          className={isHackerMode ? 'bg-red-900/20 text-red-400 border-red-500/30 hover:bg-red-900/40' : 'bg-jarvis/20 text-jarvis border-jarvis/30 hover:bg-jarvis/30'}
        >
          <Plus size={16} />
        </Button>
      </div>
      
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 italic text-sm py-4">
              No tasks yet. Add some tasks to get started.
            </p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className={`p-2 rounded-md ${isHackerMode ? 'bg-red-900/10' : 'bg-jarvis/5'} border ${task.completed ? 'border-green-500/30' : (isHackerMode ? 'border-red-500/30' : 'border-jarvis/30')}`}>
                {editingTaskId === task.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className={`flex-1 ${isHackerMode ? 'bg-black text-white border-red-500/30' : 'bg-black/30 text-white border-jarvis/30'}`}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task.id)}
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleSaveEdit(task.id)}
                      className={isHackerMode ? 'border-red-500/30 text-red-400' : 'border-jarvis/30 text-jarvis'}
                    >
                      <Check size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setEditingTaskId(null)}
                      className={isHackerMode ? 'border-red-500/30 text-red-400' : 'border-jarvis/30 text-jarvis'}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleUpdateTask(task.id, !task.completed)}
                        className={task.completed 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : (isHackerMode ? 'border-red-500/30 text-red-400' : 'border-jarvis/30 text-jarvis')
                        }
                      >
                        {task.completed ? <Check size={14} /> : <Clock size={14} />}
                      </Button>
                      <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className={isHackerMode ? 'text-red-400 border-red-500/30' : 'text-jarvis border-jarvis/30'}>
                        {task.priority}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditTask(task.id)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
