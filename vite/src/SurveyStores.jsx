import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import './SurveyStores.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SurveyStores = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  
  
  const branches = [
    { id: 1, name: "Lucknow" },
    { id: 2, name: "Kanpur" },
    { id: 3, name: "Varanasi" }
  ];
  
  const storeTypes = [
    { id: 1, name: "Eastern" },
    { id: 2, name: "Western" }
  ];
  
  const navigate = useNavigate();

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleBranchChange = (branchId) => {
    setSelectedBranches(prev => {
      if (prev.includes(branchId)) {
        return prev.filter(id => id !== branchId);
      } else {
        return [...prev, branchId];
      }
    });
  };

  const handleStoreChange = (storeId) => {
    setSelectedStores(prev => {
      if (prev.includes(storeId)) {
        return prev.filter(id => id !== storeId);
      } else {
        return [...prev, storeId];
      }
    });
  };

  const fetchSalesData = async () => {
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }
  
    if (selectedBranches.length === 0) {
      setError("Please select at least one branch");
      return;
    }
  
    if (selectedStores.length === 0) {
      setError("Please select at least one store");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      
      const fullStoreNames = [];
      selectedBranches.forEach(branchId => {
        const branchName = branches.find(b => b.id === branchId).name;
        selectedStores.forEach(storeId => {
          const storeType = storeTypes.find(s => s.id === storeId).name;
          fullStoreNames.push(`${branchName} - ${storeType}`);
        });
      });
      
      const response = await axios.post('http://localhost:5000/api/sales-by-product', {
        date: selectedDate,
        branches: selectedBranches.map(id => branches.find(b => b.id === id).name),
        stores: fullStoreNames
      });
      
      setSalesData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      setLoading(false);
      console.error(err);
    }
  };
  
  const goBack = () => {
    navigate(-1);
  };

  
  const getChartData = () => {
    if (!salesData) return null;
    const locations = [...new Set(salesData.map(item => `${item.branch_name} - ${item.store_name}`))];
    const products = [...new Set(salesData.map(item => item.product_name))];
    const colors = {
      'Product A': '#ff3333',
      'Product B': '#33ff33',
      'Product C': '#3333ff'
    };
    const datasets = products.map(product => {
      const productData = {};
      locations.forEach(location => {
        productData[location] = 0;
      });
      salesData.filter(item => item.product_name === product).forEach(item => {
        const location = `${item.branch_name} - ${item.store_name}`;
        productData[location] = item.quantity_sold;
      });
      return {
        label: product,
        data: locations.map(location => productData[location]),
        backgroundColor: colors[product] || '#999999',
        borderColor: colors[product] || '#999999',
        borderWidth: 1
      };
    });
    return {
      labels: locations,
      datasets: datasets
    };
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        },
        title: {
          display: true,
          text: 'Quantity Sold',
          color: '#ffffff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      },
      title: {
        display: true,
        text: `Product Sales by Store (${selectedDate})`,
        color: '#ffffff',
        font: {
          size: 16
        }
      }
    }
  };


  const getProductTotals = () => {
    if (!salesData) return [];
    
    const products = [...new Set(salesData.map(item => item.product_name))];
    
    return products.map(product => {
      const total = salesData
        .filter(item => item.product_name === product)
        .reduce((sum, item) => sum + item.quantity_sold, 0);
        
      return { product, total };
    });
  };

  return (
    <div className="survey-stores-container">
      <h1 className="heading">Store Sales Survey</h1>
      
      <div className="filters-section">
        <div className="date-filter">
          <label htmlFor="datePicker">Select Date:</label>
          <input
            id="datePicker"
            type="date"
            className="date-picker"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        
        <div className="branch-filter">
          <label>Select Branches:</label>
          <div className="checkbox-group">
            {branches.map(branch => (
              <div key={branch.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`branch-${branch.id}`}
                  checked={selectedBranches.includes(branch.id)}
                  onChange={() => handleBranchChange(branch.id)}
                />
                <label htmlFor={`branch-${branch.id}`}>{branch.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="store-filter">
          <label>Select Store Types:</label>
          <div className="checkbox-group">
            {storeTypes.map(store => (
              <div key={store.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`store-${store.id}`}
                  checked={selectedStores.includes(store.id)}
                  onChange={() => handleStoreChange(store.id)}
                />
                <label htmlFor={`store-${store.id}`}>{store.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <button className="fetch-button" onClick={fetchSalesData} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Sales Data'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {salesData && salesData.length > 0 ? (
        <div className="results-section">
          <div className="summary">
            <h3>Product Sales Summary</h3>
            <div className="product-totals">
              {getProductTotals().map(item => (
                <div key={item.product} className="product-total-item">
                  <span className="product-name">{item.product}:</span>
                  <span className="product-value">{item.total} units</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="chart-container">
            <Bar data={getChartData()} options={chartOptions} />
          </div>
          
          <div className="data-table">
            <h3>Sales Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Store</th>
                  <th>Product</th>
                  <th>Quantity Sold</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.branch_name}</td>
                    <td>{item.store_name}</td>
                    <td>{item.product_name}</td>
                    <td>{item.quantity_sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : salesData && salesData.length === 0 ? (
        <div className="no-data-message">
          No sales data found for the selected criteria.
        </div>
      ) : null}
      
      <button className="back-button" onClick={goBack}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default SurveyStores;