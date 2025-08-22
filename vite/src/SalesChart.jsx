import React from 'react';
import styles from './styles.module.css';

const SalesChart = ({ plotImage }) => {
  return (
    <div className={styles.chart}>
      <img src={plotImage} alt="Sales Chart" className={styles.chartImg} />
    </div>
  );
};

export default SalesChart;