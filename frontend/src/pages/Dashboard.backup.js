import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getAllTasks();
      setTasks(response.data.data.tasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await tasksAPI.createTask(taskData);
      setTasks([response.data.data.task, ...tasks]);
      toast.success('Task created successfully!');
      setShowTaskForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const response = await tasksAPI.updateTask(id, taskData);
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, ...response.data.data.task } : task
      ));
      toast.success('Task updated successfully!');
      setEditingTask(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
        toast.success('Task deleted successfully!');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.username}! Manage your tasks here.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowTaskForm(true)}
        >
          Add New Task
        </button>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Your Tasks ({tasks.length})</h3>
            </div>
            <div className="card-body">
              <TaskList 
                tasks={tasks}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                isAdmin={isAdmin()}
              />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Stats</h3>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <strong>Total Tasks:</strong> {tasks.length}
              </div>
              <div className="mb-2">
                <strong>Pending:</strong> {tasks.filter(t => t.status === 'pending').length}
              </div>
              <div className="mb-2">
                <strong>In Progress:</strong> {tasks.filter(t => t.status === 'in-progress').length}
              </div>
              <div className="mb-2">
                <strong>Completed:</strong> {tasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="mb-2">
                <strong>High Priority:</strong> {tasks.filter(t => t.priority === 'high').length}
              </div>
            </div>
          </div>

          {isAdmin() && (
            <div className="card mt-3">
              <div className="card-header">
                <h3 className="card-title">Admin Panel</h3>
              </div>
              <div className="card-body">
                <p>You have admin privileges. You can:</p>
                <ul>
                  <li>View all users' tasks</li>
                  <li>Manage user accounts</li>
                  <li>Access admin-only features</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={(taskData) => handleUpdateTask(editingTask.id, taskData)}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;