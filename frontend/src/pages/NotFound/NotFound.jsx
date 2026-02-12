import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <button onClick={() => navigate('/')} className="home-button">
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
