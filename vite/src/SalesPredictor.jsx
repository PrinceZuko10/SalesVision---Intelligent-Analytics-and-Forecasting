import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import SalesResults from './SalesResults';

const SalesPredictor = () => {
  const [month, setMonth] = useState('');
  const [months, setMonths] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available months on component mount
  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/predict/months');
        const data = await response.json();
        setMonths(data.months);
        if (data.months.length > 0) {
          setMonth(data.months[0]); // Set first month as default
        }
      } catch (error) {
        console.error('Error fetching months:', error);
      }
    };
    
    fetchMonths();
  }, []);

  const handlePredict = async () => {
    if (!month) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/predict/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month }),
      });
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Product Sales Predictor</h1>
      <p>Predict which product family will sell the most in a selected month</p>
      
      <div className={styles.formGroup}>
        <label htmlFor="month">Select Month:</label>
        <select
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          disabled={isLoading}
          className={styles.select}
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      
      <button 
        onClick={handlePredict} 
        disabled={isLoading}
        className={styles.button}
      >
        {isLoading ? 'Predicting...' : 'Predict Top Product'}
      </button>

      {prediction && <SalesResults prediction={prediction} />}
    </div>
  );
};

export default SalesPredictor;