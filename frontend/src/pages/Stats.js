import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

const Stats = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);
  const getTasksByPriority = (priority) => tasks.filter(t => t.priority === priority);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <h1>Task Statistics</h1>
        <p>Overview of your task management and productivity metrics</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Overall Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📊 Overall Statistics</h3>
          </div>
          <div className="card-body">
            <div className="mb-3" style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
              {tasks.length} Total Tasks
            </div>
            <div className="mb-2">
              <strong>Average per status:</strong>
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              • {Math.round(tasks.length / 3)} tasks per status category
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📋 Status Breakdown</h3>
          </div>
          <div className="card-body">
            <div className="mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🔄 Pending:</span>
              <span style={{ fontWeight: 'bold', color: '#6c757d' }}>
                {getTasksByStatus('pending').length}
              </span>
            </div>
            <div className="mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>⚡ In Progress:</span>
              <span style={{ fontWeight: 'bold', color: '#ffc107' }}>
                {getTasksByStatus('in-progress').length}
              </span>
            </div>
            <div className="mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>✅ Completed:</span>
              <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                {getTasksByStatus('completed').length}
              </span>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🎯 Priority Breakdown</h3>
          </div>
          <div className="card-body">
            <div className="mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🔴 High Priority:</span>
              <span style={{ fontWeight: 'bold', color: '#dc3545' }}>
                {getTasksByPriority('high').length}
              </span>
            </div>
            <div className="mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🟡 Medium Priority:</span>
              <span style={{ fontWeight: 'bold', color: '#ffc107' }}>
                {getTasksByPriority('medium').length}
              </span>
            </div>
            <div className="mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🟢 Low Priority:</span>
              <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                {getTasksByPriority('low').length}
              </span>
            </div>
          </div>
        </div>

        {/* Productivity Metrics */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📈 Productivity Metrics</h3>
          </div>
          <div className="card-body">
            <div className="mb-2">
              <strong>Completion Rate:</strong>
              <div style={{ fontSize: '18px', color: '#28a745', fontWeight: 'bold' }}>
                {tasks.length > 0 ? Math.round((getTasksByStatus('completed').length / tasks.length) * 100) : 0}%
              </div>
            </div>
            <div className="mb-2">
              <strong>Active Tasks:</strong>
              <div style={{ fontSize: '16px', color: '#007bff' }}>
                {getTasksByStatus('in-progress').length + getTasksByStatus('pending').length}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🕒 Recent Activity</h3>
          </div>
          <div className="card-body">
            <div className="mb-2">
              <strong>Latest Tasks:</strong>
            </div>
            {tasks.slice(0, 3).map(task => (
              <div key={task.id} style={{ fontSize: '14px', marginBottom: '8px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <div style={{ fontWeight: '500' }}>{task.title}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {task.status} • {task.priority} priority
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div style={{ color: '#666', fontStyle: 'italic' }}>No tasks yet</div>
            )}
          </div>
        </div>

        {/* Admin Panel */}
        {isAdmin() && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">👑 Admin Overview</h3>
            </div>
            <div className="card-body">
              <p>You have admin privileges. You can:</p>
              <ul style={{ fontSize: '14px' }}>
                <li>View all users' tasks</li>
                <li>Manage user accounts</li>
                <li>Access admin-only features</li>
              </ul>
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
                <strong>System Stats:</strong>
                <div style={{ fontSize: '14px', marginTop: '5px' }}>
                  Total tasks in system: {tasks.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;