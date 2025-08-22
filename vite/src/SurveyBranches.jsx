import React, { useState } from 'react';
import './SurveyBranches.css';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SurveyBranches() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedBranch, setSelectedBranch] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  
  const branches = ['Lucknow', 'Kanpur', 'Varanasi'];

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const fetchData = async () => {
    if (!selectedDate || !selectedBranch) {
      setError("Please select both date and branch");
      return;
    }
  
    setLoading(true);
    setError(null);
    setDebugInfo(null);
  
   
    const params = {
      date: selectedDate,
      branches: selectedBranch 
    };
  
    
    console.log('Sending request with params:', params);
  
    try {
      const response = await axios.get('http://localhost:5000/survey-branches', { params });
      
      
      console.log('Response received:', response);
      
      if (response.data && response.data.success) {
        setSalesData(response.data.sales || []);
        if (response.data.sales.length === 0) {
          setDebugInfo("Server returned success but with empty sales array");
        }
      } else {
        setError('Failed to fetch sales data: ' + (response.data?.message || 'Unknown error'));
        setDebugInfo(`Response success flag: ${response.data?.success}, Message: ${response.data?.message || 'None'}`);
        setSalesData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      
      let errorMessage = 'Failed to fetch sales data. ';
      
      if (error.response) {
        
        errorMessage += `Server responded with status ${error.response.status}: ${error.response.data?.message || 'No message'}`;
        setDebugInfo(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}, Request params: ${JSON.stringify(params)}`);
      } else if (error.request) {
        errorMessage += 'No response received from server. CORS issue or server not running?';
        setDebugInfo('Request was sent but no response was received. Check if server is running.');
      } else {
        errorMessage += error.message;
        setDebugInfo(`Error message: ${error.message}`);
      }
      
      setError(errorMessage);
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };
  
  const getChartData = () => {
    if (!salesData || salesData.length === 0) return null;
    
    return {
      labels: salesData.map(item => item.product_name),
      datasets: [
        {
          label: `${selectedBranch} Sales Quantity`,
          data: salesData.map(item => item.quantity_sold),
          backgroundColor: '#4C6EF5',
          borderColor: '#3B5EE6',
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#cccccc'
        },
        title: {
          display: true,
          text: 'Quantity Sold',
          color: '#cccccc'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#cccccc'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#cccccc'
        }
      },
      title: {
        display: true,
        text: `Product Sales for ${selectedBranch} (${selectedDate})`,
        color: '#cccccc',
        font: {
          size: 16
        }
      }
    }
  };

  return (
    <div className="main-container">
      <div className="survey-branches-container">
        <h1 className="title">Branch Sales Analysis</h1>
        
        <div className="form-container">
          <div className="form-group">
            <label>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="date-picker"
            />
          </div>
          
          <div className="form-group">
            <label>Select Branch:</label>
            <select
              value={selectedBranch}
              onChange={handleBranchChange}
              className="branch-select"
            >
              <option value="">Select a branch</option>
              {branches.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <button 
            className="fetch-button" 
            onClick={fetchData} 
            disabled={loading || !selectedDate || !selectedBranch}
          >
            {loading ? 'Loading...' : 'View Sales Data'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            {debugInfo && (
              <details>
                <summary>Debug Info</summary>
                <pre>{debugInfo}</pre>
              </details>
            )}
          </div>
        )}

        <div className="chart-section">
          {loading ? (
            <div className="message">Loading sales data...</div>
          ) : salesData.length > 0 ? (
            <div className="chart-container">
              <div style={{ height: '400px', width: '100%' }}>
                <Bar data={getChartData()} options={chartOptions} />
              </div>
              
              <div className="data-table">
                <h3>Sales Details</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity_sold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="message">
              {selectedDate && selectedBranch 
                ? 'No sales data available for the selected criteria.' 
                : 'Please select both date and branch to view sales data.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SurveyBranches;