// database.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,     // Adresse du serveur (exemple: localhost)
  user: process.env.DB_USER,     // Nom d'utilisateur de la base de données
  password: process.env.DB_PASS, // Mot de passe de la base de données
  database: process.env.DB_NAME  // Nom de la base de données
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

module.exports = db;