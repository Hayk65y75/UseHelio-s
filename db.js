const mysql = require('mysql2');
require('dotenv').config(); // Charge les variables d'environnement à partir de .env

// Créer une connexion à la base de données
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Tester la connexion
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données : ', err);
    return;
  }
  console.log('Connecté à la base de données MySQL!');
});

// Exporter la connexion pour l'utiliser ailleurs
module.exports = connection;
