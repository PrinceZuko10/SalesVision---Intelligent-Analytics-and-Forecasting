import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UserInfo.css';

function UserInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Roboto:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handlePredictClick = () => {
    navigate('/sales-predictor');
  };

  return (
    <div className="main-container">
      <div className="user-info-container">
        <h1 className="title">User Information</h1>
        {user ? (
          <div className="user-details">
            <p><strong>ID:</strong> {user.user_id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Position:</strong> {user.position}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            {user.position === 'Branch Manager' && (
              <p><strong>Branch:</strong> {user.branches}</p>
            )}
            {user.position === 'Store Manager' && (
              <>
                <p><strong>Branch:</strong> {user.branches}</p>
                <p><strong>Store:</strong> {user.stores}</p>
              </>
            )}
          </div>
        ) : (
          <p className="message">No user data available.</p>
        )}
        
        <div className="button-group">
          <button 
            className="action-button predict-button" 
            onClick={handlePredictClick}
          >
            Sales Prediction
          </button>
          <button 
            className="action-button back-button" 
            onClick={() => navigate('/')}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;