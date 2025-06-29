import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Calendar,
  Target,
  Brain,
  Loader2,
  Sparkles,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { databaseHelpers } from '../lib/database';
import { authHelpers } from '../lib/supabase';
import ProfilePage from './ProfilePage';

interface Task {
  id: string;
  raw_command: string;
  intent?: string;
  status: 'pending' | 'done' | 'error';
  created_at: string;
  completed_at?: string;
  subtasks?: Subtask[];
}

interface Subtask {
  id: string;
  task_id: string;
  description: string;
  completed: boolean;
  created_at: string;
}

interface SuggestedSubtask {
  description: string;
  saved: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingTask, setAddingTask] = useState(false);
  const [generatingSubtasks, setGeneratingSubtasks] = useState<string | null>(null);
  const [suggestedSubtasks, setSuggestedSubtasks] = useState<Record<string, SuggestedSubtask[]>>({});

  useEffect(() => {
    if (user && currentView === 'dashboard') {
      loadTasks();
    }
  }, [user, currentView]);

  const loadTasks = async () => {
    try {
      const { data, error } = await databaseHelpers.getUserTaskHistory(20);
      if (error) {
        console.error('Error loading tasks:', error);
      } else {
        setTasks(data || []);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    setAddingTask(true);
    try {
      const { data, error } = await databaseHelpers.addTaskToHistory(
        newTask.trim(),
        undefined,
        'pending'
      );
      
      if (error) {
        console.error('Error adding task:', error);
      } else {
        setNewTask('');
        await loadTasks();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setAddingTask(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: 'pending' | 'done' | 'error') => {
    try {
      // Update in database (you'll need to implement this in databaseHelpers)
      // For now, update locally
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status, completed_at: status === 'done' ? new Date().toISOString() : undefined }
          : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Delete from database (you'll need to implement this in databaseHelpers)
      // For now, update locally
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditingText(task.raw_command);
  };

  const saveEdit = async () => {
    if (!editingTask || !editingText.trim()) return;
    
    try {
      // Update in database (you'll need to implement this in databaseHelpers)
      // For now, update locally
      setTasks(prev => prev.map(task => 
        task.id === editingTask 
          ? { ...task, raw_command: editingText.trim() }
          : task
      ));
      setEditingTask(null);
      setEditingText('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditingText('');
  };

  const generateSubtasks = async (taskId: string, mainTask: string) => {
    setGeneratingSubtasks(taskId);
    
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-subtasks`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mainTask })
      });

      if (!response.ok) {
        throw new Error('Failed to generate subtasks');
      }

      const { subtasks } = await response.json();
      
      // Store suggested subtasks
      setSuggestedSubtasks(prev => ({
        ...prev,
        [taskId]: subtasks.map((description: string) => ({
          description,
          saved: false
        }))
      }));

    } catch (error) {
      console.error('Error generating subtasks:', error);
      // You might want to show a toast notification here
    } finally {
      setGeneratingSubtasks(null);
    }
  };

  const saveSubtask = async (taskId: string, subtaskIndex: number) => {
    const suggestions = suggestedSubtasks[taskId];
    if (!suggestions || !suggestions[subtaskIndex]) return;

    try {
      // Add subtask to database (you'll need to implement this)
      // For now, just mark as saved locally
      setSuggestedSubtasks(prev => ({
        ...prev,
        [taskId]: prev[taskId].map((subtask, index) => 
          index === subtaskIndex 
            ? { ...subtask, saved: true }
            : subtask
        )
      }));
    } catch (error) {
      console.error('Error saving subtask:', error);
    }
  };

  const handleSignOut = async () => {
    await authHelpers.signOut();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-5 h-5 text-[#00FFAB]" strokeWidth={1.5} />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#FF6B35]" strokeWidth={1.5} />;
      default:
        return <Clock className="w-5 h-5 text-[#1F51FF]" strokeWidth={1.5} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'border-[#00FFAB]/30 bg-[#00FFAB]/5';
      case 'error':
        return 'border-[#FF6B35]/30 bg-[#FF6B35]/5';
      default:
        return 'border-[#1F51FF]/30 bg-[#1F51FF]/5';
    }
  };

  if (loading && currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-[#101010]" strokeWidth={1.5} />
          </div>
          <div className="w-8 h-8 border-2 border-[#00FFAB]/30 border-t-[#00FFAB] rounded-full loading-ring mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show profile page
  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-[#101010]">
        {/* Navigation */}
        <nav className="glass-panel border-b border-[#2A2A2A] p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-lg flex items-center justify-center voice-calm">
                <Brain className="w-5 h-5 text-[#101010] icon-hover" strokeWidth={1.5} />
              </div>
              <span className="text-xl font-header font-bold text-[#F2F2F2]">RajniAI</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-[#F2F2F2]/70 hover:text-[#00FFAB] font-body icon-hover"
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className="text-[#00FFAB] font-body"
              >
                Profile
              </button>
              <button
                onClick={handleSignOut}
                className="text-[#F2F2F2]/70 hover:text-[#FF6B35] font-body icon-hover flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </nav>
        
        <ProfilePage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101010]">
      {/* Navigation */}
      <nav className="glass-panel border-b border-[#2A2A2A] p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-lg flex items-center justify-center voice-calm">
              <Brain className="w-5 h-5 text-[#101010] icon-hover" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-header font-bold text-[#F2F2F2]">RajniAI</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-[#00FFAB] font-body"
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className="text-[#F2F2F2]/70 hover:text-[#00FFAB] font-body icon-hover flex items-center space-x-2"
            >
              <User className="w-4 h-4" strokeWidth={1.5} />
              <span>Profile</span>
            </button>
            <button
              onClick={handleSignOut}
              className="text-[#F2F2F2]/70 hover:text-[#FF6B35] font-body icon-hover flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-[#101010]" strokeWidth={1.5} />
              </div>
              <h1 className="font-header text-3xl font-bold text-[#F2F2F2]">
                Your <span className="text-[#00FFAB]">RajniAI</span> Dashboard
              </h1>
            </div>
            <p className="font-body text-[#F2F2F2]/70 max-w-2xl mx-auto">
              Welcome back, {user?.user_metadata?.full_name || user?.email}! 
              Manage your tasks and let Rajni help you break them down into actionable steps.
            </p>
          </div>

          {/* Add New Task */}
          <div className="glass-panel p-6 rounded-2xl border border-[#2A2A2A]/50 mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="What would you like Rajni to help you with?"
                  className="w-full bg-[#2A2A2A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[#F2F2F2] placeholder-[#F2F2F2]/40 focus:outline-none focus:border-[#00FFAB] focus:ring-1 focus:ring-[#00FFAB] font-body"
                />
              </div>
              <button
                onClick={addTask}
                disabled={!newTask.trim() || addingTask}
                className="bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-6 py-3 rounded-xl font-header font-semibold btn-lift btn-ripple disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {addingTask ? (
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
                ) : (
                  <Plus className="w-5 h-5" strokeWidth={1.5} />
                )}
                <span>{addingTask ? 'Adding...' : 'Add Task'}</span>
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="glass-panel p-12 rounded-2xl border border-[#2A2A2A]/50 text-center">
                <Calendar className="w-16 h-16 text-[#F2F2F2]/30 mx-auto mb-4" strokeWidth={1} />
                <h3 className="font-header text-xl font-semibold text-[#F2F2F2] mb-2">No tasks yet</h3>
                <p className="font-body text-[#F2F2F2]/60">
                  Add your first task above and let Rajni help you break it down into manageable steps.
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className={`glass-panel p-6 rounded-2xl border ${getStatusColor(task.status)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => updateTaskStatus(
                          task.id, 
                          task.status === 'done' ? 'pending' : 'done'
                        )}
                        className="mt-1 btn-lift"
                      >
                        {getStatusIcon(task.status)}
                      </button>
                      
                      <div className="flex-1">
                        {editingTask === task.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="flex-1 bg-[#2A2A2A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-[#F2F2F2] focus:outline-none focus:border-[#00FFAB] font-body"
                              autoFocus
                            />
                            <button
                              onClick={saveEdit}
                              className="text-[#00FFAB] hover:text-[#00FFAB]/80 btn-lift"
                            >
                              <Save className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-[#F2F2F2]/60 hover:text-[#F2F2F2] btn-lift"
                            >
                              <X className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <h3 className={`font-header text-lg font-semibold mb-1 ${
                              task.status === 'done' ? 'text-[#F2F2F2]/60 line-through' : 'text-[#F2F2F2]'
                            }`}>
                              {task.raw_command}
                            </h3>
                            {task.intent && (
                              <p className="font-body text-[#F2F2F2]/60 text-sm">
                                Intent: {task.intent}
                              </p>
                            )}
                            <p className="font-body text-[#F2F2F2]/40 text-xs mt-1">
                              Created: {new Date(task.created_at).toLocaleDateString()}
                              {task.completed_at && (
                                <span> • Completed: {new Date(task.completed_at).toLocaleDateString()}</span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => startEditing(task)}
                        className="text-[#F2F2F2]/60 hover:text-[#1F51FF] btn-lift"
                      >
                        <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-[#F2F2F2]/60 hover:text-[#FF6B35] btn-lift"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  {/* Generate Subtasks Button */}
                  <div className="border-t border-[#2A2A2A]/50 pt-4">
                    <button
                      onClick={() => generateSubtasks(task.id, task.raw_command)}
                      disabled={generatingSubtasks === task.id}
                      className="bg-gradient-to-r from-[#1F51FF] to-[#00FFAB] text-[#101010] px-4 py-2 rounded-lg font-header font-medium btn-lift btn-ripple disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
                    >
                      {generatingSubtasks === task.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                          <span>Generate Subtasks with AI</span>
                        </>
                      )}
                    </button>

                    {/* Suggested Subtasks */}
                    {suggestedSubtasks[task.id] && suggestedSubtasks[task.id].length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-header text-sm font-semibold text-[#F2F2F2]/80 mb-2">
                          Suggested Subtasks:
                        </h4>
                        {suggestedSubtasks[task.id].map((subtask, index) => (
                          <div key={index} className="flex items-center justify-between bg-[#2A2A2A]/50 rounded-lg p-3">
                            <span className="font-body text-[#F2F2F2]/80 text-sm flex-1">
                              {subtask.description}
                            </span>
                            <button
                              onClick={() => saveSubtask(task.id, index)}
                              disabled={subtask.saved}
                              className={`ml-3 px-3 py-1 rounded-md text-xs font-header font-medium btn-lift ${
                                subtask.saved
                                  ? 'bg-[#00FFAB]/20 text-[#00FFAB] cursor-not-allowed'
                                  : 'bg-[#00FFAB] text-[#101010] hover:bg-[#00FFAB]/90'
                              }`}
                            >
                              {subtask.saved ? 'Saved' : 'Save'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;