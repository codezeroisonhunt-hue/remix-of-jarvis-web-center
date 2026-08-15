
import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, PlusCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

interface TaskManagementProps {
  tasks?: Task[];
  onAddTask?: (task: Omit<Task, 'id'>) => void;
  onToggleTask?: (id: string) => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({ 
  tasks = [],
  onAddTask,
  onToggleTask
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim() && onAddTask) {
      onAddTask({
        title: newTaskTitle,
        completed: false,
        priority: 'medium'
      });
      setNewTaskTitle('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="border-jarvis/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="mr-2 h-4 w-4" /> Task Management
        </CardTitle>
        <CardDescription>Organize and manage your tasks and reminders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Add new task..."
            className="bg-black/40 border-jarvis/20 text-white"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <Button 
            onClick={handleAddTask} 
            disabled={!newTaskTitle.trim()}
            className="bg-jarvis hover:bg-jarvis/90"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-jarvis/30 scrollbar-track-transparent pr-1">
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No tasks yet. Add a new task to get started.</p>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className={`flex items-center justify-between p-2 rounded-md ${task.completed ? 'bg-jarvis/10' : 'bg-black/40'} border border-jarvis/20`}
              >
                <div className="flex items-center">
                  <button
                    onClick={() => onToggleTask && onToggleTask(task.id)}
                    className="mr-2"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-jarvis" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <span className={task.completed ? 'line-through text-gray-400' : 'text-white'}>
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {task.dueDate && (
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.dueDate.toLocaleDateString()}
                    </div>
                  )}
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
