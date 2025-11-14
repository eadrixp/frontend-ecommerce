// PostgreSQL Database Configuration
const postgresConfig = {
  user: process.env.REACT_APP_DB_USER || 'postgres',
  password: process.env.REACT_APP_DB_PASSWORD || 'Guatemala2002',
  host: process.env.REACT_APP_DB_HOST || 'localhost',
  port: parseInt(process.env.REACT_APP_DB_PORT || '5432'),
  database: process.env.REACT_APP_DB_NAME || 'ecommerce_db',
};

export default postgresConfig;
