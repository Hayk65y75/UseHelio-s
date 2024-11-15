const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

let isConnected = false;

async function connectDatabase() {
  if (isConnected) return;
  
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    isConnected = true;
    console.log('✅ Connexion à la base de données MySQL établie avec succès.');
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
}

async function getDatabase() {
  if (!isConnected) {
    await connectDatabase();
  }
  return sequelize;
}

module.exports = {
  sequelize,
  connectDatabase,
  getDatabase
};