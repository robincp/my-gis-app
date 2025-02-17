const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const AWS = require('aws-sdk');

// Initialize express app
const app = express();
const port = 5000;  // You can choose any free port

// Enable CORS for frontend React app
app.use(cors());

// Initialize AWS SDK and fetch database credentials from AWS Secrets Manager
const secretsManager = new AWS.SecretsManager({ region: 'us-east-1' });  // Use the correct region

async function getDbCredentials() {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: 'your-secret-id' }).promise();
    const secret = JSON.parse(data.SecretString);
    return {
      host: 'your-db-endpoint', // Replace with your DB endpoint
      user: secret.username,
      password: secret.password,
      database: 'your-database-name',
      port: 5432
    };
  } catch (error) {
    console.error("Error fetching secret:", error);
  }
}

// Set up a pool to interact with PostgreSQL
const pool = new Pool({
  // Database connection details, to be fetched dynamically
  host: 'gis-app-db.cr0kagcamaxh.us-east-1.rds.amazonaws.com',  // Replace with your RDS endpoint
  user: 'postgres',  // Your database username
  password: 'fOy5cOgtZf4xF2l63DVL',  // Your database password
  database: 'gis_app',  // Your database name
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Use this for non-production environments. For production, properly configure certificates.
  }
});

app.get('/locations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM national_grid_locations');
    res.json(result.rows);
  } catch (error) {
    console.error("Error querying the database:", error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
