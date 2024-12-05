const { Sequelize } = require('sequelize');

// Configuration Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nom de la base
  process.env.DB_USER, // Utilisateur
  process.env.DB_PASS, // Mot de passe
  {
    host: process.env.DB_HOST.replace('http://', ''), // Hôte (sans "http://")
    dialect: 'mysql', // Type de base (MySQL dans ce cas)
    logging: false,   // Désactiver les logs SQL
  }
);

// Tester la connexion
async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie.');
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données :', error);
  }
}

connectDatabase(); // Effectue un test lors du démarrage

module.exports = sequelize; // Export de l'instance Sequelize
