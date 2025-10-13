import React from 'react';

const TaskList = ({ tasks, onEdit, onDelete, isAdmin }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'in-progress':
        return '#ffc107';
      case 'pending':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center" style={{ padding: '40px' }}>
        <p style={{ color: '#666', fontSize: '16px' }}>No tasks found. Create your first task!</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className="card mb-2" style={{ borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div style={{ flex: 1 }}>
                <h5 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                  {task.title}
                </h5>
                
                {task.description && (
                  <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                    {task.description}
                  </p>
                )}

                <div className="d-flex gap-2 align-items-center" style={{ fontSize: '12px' }}>
                  <span 
                    style={{ 
                      padding: '2px 8px', 
                      backgroundColor: getStatusColor(task.status), 
                      color: 'white', 
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}
                  >
                    {task.status.replace('-', ' ').toUpperCase()}
                  </span>
                  
                  <span 
                    style={{ 
                      padding: '2px 8px', 
                      backgroundColor: getPriorityColor(task.priority), 
                      color: 'white', 
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}
                  >
                    {task.priority.toUpperCase()}
                  </span>

                  {isAdmin && (
                    <span style={{ color: '#666' }}>
                      by {task.user_name}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                  Created: {new Date(task.created_at).toLocaleDateString()}
                  {task.updated_at !== task.created_at && (
                    <span> • Updated: {new Date(task.updated_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <div className="d-flex gap-1">
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                  onClick={() => onEdit(task)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger" 
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                  onClick={() => onDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
