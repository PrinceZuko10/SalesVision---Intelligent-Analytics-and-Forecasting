import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeList.css';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Roboto:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/employees')
      .then((res) => {
        if (res.data.success) {
          setEmployees(res.data.employees);
          setError(null);
        } else {
          setError('Failed to fetch employees');
        }
      })
      .catch((err) => {
        setError('Error connecting to server');
        console.error('Error fetching employees:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="main-container">
      <div className="employee-list-container">
        <h1 className="title">Employee List</h1>
        
        {loading ? (
          <p className="message">Loading employees...</p>
        ) : error ? (
          <p className="message">{error}</p>
        ) : employees.length > 0 ? (
          <div className="employee-list">
            {employees.map((emp) => (
              <div key={emp.user_id} className="employee-item">
                <p><strong>ID:</strong> {emp.user_id}</p>
                <p><strong>Name:</strong> {emp.name}</p>
                <p><strong>Age:</strong> {emp.age}</p>
                <p><strong>Gender:</strong> {emp.gender}</p>
                <p><strong>Position:</strong> {emp.position}</p>
                {emp.branches && <p><strong>Branch:</strong> {emp.branches}</p>}
                {emp.stores && <p><strong>Store:</strong> {emp.stores}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="message">No employees found.</p>
        )}
      </div>
    </div>
  );
}

export default EmployeeList;