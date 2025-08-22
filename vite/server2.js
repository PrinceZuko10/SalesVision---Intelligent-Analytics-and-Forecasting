import express from 'express';
import mysql from 'mysql2/promise';  // Using promise-based version
import cors from 'cors';
import bodyParser from 'body-parser';
import { salesPredictor } from './salesPredictor.js';
import { generateSalesChart } from './chartGenerator.js';

const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1qazxcvb',
  database: 'sales_analysis'
});

try {
  await db.connect();
  console.log('Connected to MySQL');
} catch (err) {
  console.error('Database connection failed:', err);
  process.exit(1);
}

app.get('/', (req, res) => {
  res.send('Server is running successfully!');
});

app.get('/api/predict/months', async (req, res) => {
  try {
    const months = await salesPredictor.getAvailableMonths();
    res.json({ success: true, months });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/predict/sales', async (req, res) => {
  try {
    const { month } = req.body;
    if (!month) {
      return res.status(400).json({ success: false, message: 'Month is required' });
    }

    const topProduct = await salesPredictor.predictTopProduct(parseInt(month));
    const historicalData = await salesPredictor.getHistoricalData();
    const chartImage = await generateSalesChart(historicalData, month, topProduct);

    res.json({ 
      success: true, 
      month, 
      topProduct, 
      chartImage 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { user_id, password } = req.body;
    const [rows] = await db.query(
      'SELECT * FROM users WHERE user_id = ? AND password = ?',
      [user_id, password]
    );
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error during query:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/employees', (req, res) => {
  const query = 'SELECT user_id, name, age, gender, position FROM users';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error during query:', err);
      res.status(500).json({ success: false, message: 'Server error' });
      return;
    }
    res.json({ success: true, employees: result });
  });
});
app.get('/survey-stores', (req, res) => {
  const selectedDate = req.query.date;
  const query = `
    SELECT product_name, SUM(quantity_sold) AS quantity_sold 
    FROM sales 
    WHERE sale_date = ? 
    GROUP BY product_name
  `;
  db.query(query, [selectedDate], (err, result) => {
    if (err) {
      console.error('Error during query:', err);
      res.status(500).json({ success: false, message: 'Server error' });
      return;
    }
    res.json({ success: true, sales: result });
  });
});
app.post('/api/sales-by-product', (req, res) => {
  const { date, branches, stores } = req.body;
  if (!date || !branches || !stores || !branches.length || !stores.length) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }
  const branchPlaceholders = branches.map(() => '?').join(',');
  const storePlaceholders = stores.map(() => '?').join(',');
  const params = [date, ...branches, ...stores];
  const query = `
    SELECT s.store_name, s.branch_name, sales.product_name, SUM(sales.quantity_sold) AS quantity_sold
    FROM sales
    JOIN stores s ON sales.store_name = s.store_name
    WHERE sales.sale_date = ?
    AND s.branch_name IN (${branchPlaceholders})
    AND s.store_name IN (${storePlaceholders})
    GROUP BY s.store_name, s.branch_name, sales.product_name
    ORDER BY s.branch_name, s.store_name, sales.product_name
  `;
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error during query:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    res.json(results);
  });
});
app.get('/survey-branches', (req, res) => {
  const { date, branches } = req.query;
  if (!date || !branches) {
    return res.status(400).json({ success: false, message: 'Date and branches are required' });
  }
  const branchList = branches.split(',').map(branch => branch.trim());
  const placeholders = branchList.map(() => '?').join(',');
  const query = `
    SELECT st.branch_name, s.product_name, SUM(s.quantity_sold) AS quantity_sold 
    FROM sales s
    JOIN stores st ON s.store_name = st.store_name
    WHERE s.sale_date = ? AND st.branch_name IN (${placeholders})
    GROUP BY st.branch_name, s.product_name
  `;
  const params = [date, ...branchList];
  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error during query:', err);
      return res.status(500).json({ success: false, message: `Database query error: ${err.message}` });
    }
    res.json({ success: true, sales: result });
  });
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
