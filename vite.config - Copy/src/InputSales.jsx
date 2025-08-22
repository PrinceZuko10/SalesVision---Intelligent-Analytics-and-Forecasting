import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InputSales.css';

function InputSales() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [formData, setFormData] = useState({
    product_name: 'Product A',
    sale_date: '',
    quantity_sold: '',
    store_name: user?.stores || '', // auto-fill for Store Managers
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/sales/input', formData); // adjust to your backend route
      alert('Sales entry added successfully!');
      navigate('/user-info', { state: { user } });
    } catch (error) {
      alert('Error saving sales data');
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Input Sales Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Store Name:</label>
          <input type="text" name="store_name" value={formData.store_name} onChange={handleChange} readOnly />
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
          <input type="date" name="sale_date" value={formData.sale_date} onChange={handleChange} required />
        </div>

        <div>
          <label>Quantity Sold:</label>
          <input type="number" name="quantity_sold" value={formData.quantity_sold} onChange={handleChange} required />
        </div>

        <button className="btn" type="submit">Submit</button>
      </form>
      <button className="btn" type="button" onClick={() => navigate('/user-info', { state: { user } })}>
        Back
      </button>
    </div>
  );
}

export default InputSales;
