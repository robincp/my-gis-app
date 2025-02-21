const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const app = express();
const port = 5000;  // You can choose any free port
app.use(cors()); // Enable CORS for frontend React app

// AWS Region
const REGION = "us-east-1"; // Change if necessary
const SECRET_NAME = "rds-db-credentials"; // Replace with your actual secret name

async function getDbCredentials() {
    const client = new SecretsManagerClient({ region: REGION });

    try {
        const response = await client.send(new GetSecretValueCommand({ SecretId: SECRET_NAME }));
        const secret = JSON.parse(response.SecretString); // Parse JSON secret

        return {
            host: secret.host,
            user: secret.username,
            password: secret.password,
            database: secret.dbname,
            port: secret.port || 5432,
            ssl: { rejectUnauthorized: false }
        };
    } catch (error) {
        console.error("Error fetching secret:", error);
        throw new Error("Failed to retrieve database credentials");
    }
}




let pool;

async function initializeDatabase() {
    try {
        const credentials = await getDbCredentials();
        pool = new Pool(credentials);
        console.log("✅ Database connection initialized");
    } catch (error) {
        console.error("❌ Database initialization failed:", error);
    }
}

// Initialize the database connection
initializeDatabase();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});


app.get('/locations', async (req, res) => {
    try {
        if (!pool) throw new Error("Database not initialized");
        const result = await pool.query('SELECT * FROM national_grid_locations');
        res.json(result.rows);
    } catch (error) {
        console.error("Error querying the database:", error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
