require('dotenv').config();
const { Sequelize } = require('sequelize');

const getSequalize = () => {
  return new Sequelize(`postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@database:${process.env.DB_PORT}/${process.env.DB_NAME}`);
}

const createConnection = async () => {
  const sequelize = getSequalize();
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

const closeConnection = async () => {
  const sequelize = getSequalize();
  sequelize.close();
}

module.exports = { getSequalize, createConnection, closeConnection };