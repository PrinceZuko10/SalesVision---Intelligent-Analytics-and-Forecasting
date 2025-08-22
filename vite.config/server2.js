import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1qazxcvb',
  database: 'sales_analysis'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.send('Server is running successfully!');
});

app.post('/login', (req, res) => {
  const { user_id, password } = req.body;
  const query = 'SELECT * FROM users WHERE user_id = ? AND password = ?';
  db.query(query, [user_id, password], (err, result) => {
    if (err) {
      console.error('Error during query:', err);
      res.status(500).json({ success: false, message: 'Server error' });
      return;
    }
    if (result.length > 0) {
      res.json({ success: true, user: result[0] });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
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
app.post('/api/signup', (req, res) => {
  const { name, age, gender, position } = req.body;

  console.log('Received signup data:', req.body); // log input

  db.query('SELECT MAX(CAST(SUBSTRING(user_id, 2) AS UNSIGNED)) AS maxId FROM users', (err, result) => {
    if (err) {
      console.error('Error getting max user_id:', err);
      return res.status(500).send(err);
    }

    const newIdNum = (result[0].maxId || 0) + 1;
    const newUserId = `U${newIdNum}`;
    const defaultPassword = position.toLowerCase().includes("admin") ? "admin123"
                            : position.toLowerCase().includes("branch") ? "branch123"
                            : "store123";

    const insertQuery = 'INSERT INTO users (user_id, name, password, position, age, gender) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [newUserId, name, defaultPassword, position, age, gender];

    console.log('Executing INSERT:', insertQuery, values); // log query

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).send(err);
      }

      console.log('Insert result:', result);
      res.send({ message: 'User added successfully', userId: newUserId });
    });
  });
});
app.get('/stores', (req, res) => {
  const query = `
    SELECT stores.store_name, stores.branch_name, sales.product_name, SUM(sales.quantity_sold) AS quantity_sold
    FROM stores
    LEFT JOIN sales ON stores.store_name = sales.store_name
    GROUP BY stores.store_name, stores.branch_name, sales.product_name
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error during query:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    res.json({ success: true, stores: result });
  });
});
// Route to fetch store names and branch names for the dropdown
app.get('/api/stores', (req, res) => {
  const query = `
    SELECT store_name, branch_name
    FROM stores
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error during query:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    // Send only store_name and branch_name to frontend
    res.json(result); // [{ store_name: "Store A", branch_name: "Branch A" }]
  });
});


// Route to input sales data
app.post('/api/sales/input', (req, res) => {
  const { store_name, product_name, sale_date, quantity_sold } = req.body;

  // Validate the data
  if (!store_name || !product_name || !sale_date || !quantity_sold) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Insert the sales data into the database
  const query = `
    INSERT INTO sales (store_name, product_name, sale_date, quantity_sold)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [store_name, product_name, sale_date, quantity_sold], (err, result) => {
    if (err) {
      console.error('Error during insertion:', err);
      return res.status(500).json({ message: 'Error saving sales data' });
    }
    // Respond with success message
    res.status(200).json({ message: 'Sales entry saved successfully' });
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
