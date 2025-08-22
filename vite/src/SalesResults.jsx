import React from 'react';
import SalesChart from './SalesChart';
import styles from './styles.module.css';

const SalesResults = ({ prediction }) => {
  return (
    <div className={styles.resultCard}>
      <h2>For month {prediction.month}:</h2>
      <p className={styles.prediction}>
        Predicted top selling product family: <strong>{prediction.topProduct}</strong>
      </p>
      
      <div className={styles.chartContainer}>
        <h3>Historical Sales Data</h3>
        <SalesChart plotImage={prediction.chartImage} />
      </div>
    </div>
  );
};

export default SalesResults;