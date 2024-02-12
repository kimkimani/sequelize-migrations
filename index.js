const express = require("express");
const config = require('./config/config.json');
const ProductsRouter = require("./products.router");
const Sequelize = require("sequelize");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mounting  routers

app.use("/api", ProductsRouter);

// Get the environment from the NODE_ENV environment variable, defaulting to 'development'
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect
});

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(3000, () => {
  console.log("listening on port 3000");
});