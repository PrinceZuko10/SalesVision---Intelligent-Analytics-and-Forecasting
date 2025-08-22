import csv from 'csv-parser';
import fs from 'fs';
import regression from 'regression';

class SalesPredictor {
  constructor() {
    this.data = [];
    this.loadData();
  }

  loadData() {
    return new Promise((resolve) => {
      fs.createReadStream('./sample_train.csv')  // Change to your CSV path
        .pipe(csv())
        .on('data', (row) => {
          const date = new Date(row.date);
          this.data.push({
            ...row,
            month: date.getMonth() + 1,
            sales: parseFloat(row.sales)
          });
        })
        .on('end', () => resolve());
    });
  }

  async getAvailableMonths() {
    await this.loadData();
    const months = [...new Set(this.data.map(item => item.month))].sort((a, b) => a - b);
    return months;
  }

  async predictTopProduct(month) {
    await this.loadData();
    
    // Group by month and family to find top selling category each month
    const monthlySales = {};
    this.data.forEach(item => {
      const key = `${item.month}-${item.family}`;
      monthlySales[key] = (monthlySales[key] || 0) + item.sales;
    });

    // Find top product for the requested month
    let maxSales = 0;
    let topProduct = '';
    Object.keys(monthlySales).forEach(key => {
      const [m, product] = key.split('-');
      if (parseInt(m) === month && monthlySales[key] > maxSales) {
        maxSales = monthlySales[key];
        topProduct = product;
      }
    });

    return topProduct;
  }

  async getHistoricalData() {
    await this.loadData();
    return this.data;
  }
}

export const salesPredictor = new SalesPredictor();