import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
              Primetrade.ai
            </Link>
            
            <div className="d-flex align-items-center gap-2">
              <span>Welcome, {user?.username}</span>
              <span style={{ padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', fontSize: '12px' }}>
                {user?.role?.toUpperCase()}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="container" style={{ paddingTop: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
