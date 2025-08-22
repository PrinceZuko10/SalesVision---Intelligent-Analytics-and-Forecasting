import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InputSales.css';

function InputSales() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  // Redirect if no user data
  useEffect(() => {
    if (!user) {
      navigate('/login'); // or wherever your login page is
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    product_name: 'Product A',
    sale_date: '',
    quantity_sold: '',
    store_name: '',
  });

  const [storeNames, setStoreNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreNames = async () => {
      try {
        // Use full URL if your frontend and backend are on different ports
        const response = await axios.get('http://localhost:5000/api/stores');
        setStoreNames(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
        setError('Failed to load stores');
      } finally {
        setLoading(false);
      }
    };
    fetchStoreNames();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/sales/input', formData);
      alert('Sales entry added successfully!');
      navigate('/user-info', { state: { user } });
    } catch (error) {
      alert('Error saving sales data: ' + (error.response?.data?.message || error.message));
      console.error(error);
    }
  };

  if (!user) {
    return null; // or a loading spinner while redirect happens
  }

  if (loading) {
    return <div>Loading stores...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="form-container">
      <h2>Input Sales Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Store Name:</label>
          <select
            name="store_name"
            value={formData.store_name}
            onChange={handleChange}
            required
          >
            <option value="">Select Store</option>
            {storeNames.map((store, index) => (
              <option key={`${store.store_name}-${index}`} value={store.store_name}>
                {store.store_name} ({store.branch_name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Product Name:</label>
          <select name="product_name" value={formData.product_name} onChange={handleChange}>
            <option value="Product A">Product A</option>
            <option value="Product B">Product B</option>
            <option value="Product C">Product C</option>
          </select>
        </div>

        <div>
          <label>Sale Date:</label>
          <input 
            type="date" 
            name="sale_date" 
            value={formData.sale_date} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <label>Quantity Sold:</label>
          <input 
            type="number" 
            name="quantity_sold" 
            value={formData.quantity_sold} 
            onChange={handleChange} 
            min="1"
            required 
          />
        </div>

        <button className="btn" type="submit">Submit</button>
      </form>
      <button 
        className="btn" 
        type="button" 
        onClick={() => navigate('/user-info', { state: { user } })}
      >
        Back
      </button>
    </div>
  );
}

export default InputSales;