import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StoreList.css';

function StoreList() {
  const [stores, setStores] = useState([]);
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
    axios.get('http://localhost:5000/stores')
      .then((res) => {
        if (res.data.success) {
          setStores(res.data.stores);
          setError(null);
        } else {
          setError('Failed to fetch store data');
        }
      })
      .catch((err) => {
        setError('Error connecting to server');
        console.error('Error fetching stores:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="main-container">
      <div className="store-list-container">
        <h1 className="title">Store List</h1>
        
        {loading ? (
          <p className="message">Loading stores...</p>
        ) : error ? (
          <p className="message">{error}</p>
        ) : stores.length > 0 ? (
          <div className="store-list">
            {stores.map((store, index) => (
              <div key={index} className="store-item">
                <p><strong>Store Name:</strong> {store.store_name}</p>
                <p><strong>Branch:</strong> {store.branch_name}</p>
                <p><strong>Product:</strong> {store.product_name}</p>
                <p><strong>Quantity Sold:</strong> {store.quantity_sold}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="message">No stores found.</p>
        )}
      </div>
    </div>
  );
}

export default StoreList;
