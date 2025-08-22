import { createCanvas } from 'canvas';
import Chart from 'chart.js';

export const generateSalesChart = async (historicalData, selectedMonth, predictedProduct) => {
  // Group data by month
  const monthlySales = {};
  historicalData.forEach(item => {
    const key = `${item.month}-${item.family}`;
    monthlySales[key] = (monthlySales[key] || 0) + item.sales;
  });

  // Prepare chart data
  const months = [...new Set(historicalData.map(item => item.month))].sort((a, b) => a - b);
  const products = [...new Set(historicalData.map(item => item.family))];
  
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');

  // Create chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: products.map(product => ({
        label: product,
        data: months.map(month => monthlySales[`${month}-${product}`] || 0),
        backgroundColor: product === predictedProduct ? 'rgba(255, 99, 132, 0.7)' : 'rgba(54, 162, 235, 0.7)'
      }))
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Predicted Top Product for Month ${selectedMonth}: ${predictedProduct}`
        }
      }
    }
  });

  return canvas.toDataURL();
};