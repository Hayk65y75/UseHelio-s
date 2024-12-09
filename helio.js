require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadHandlers } = require('./handlers');
const { deploy } = require('./functions/deploy');
const sequelize = require('./functions/deploy/database'); // Import de la connexion Sequelize

// Vérification des variables d'environnement
if (!process.env.DISCORD_TOKEN) {
  console.error('❌ Error: DISCORD_TOKEN is required in .env file');
  process.exit(1);
}

if (!process.env.CLIENT_ID) {
  console.error('❌ Error: CLIENT_ID is required in .env file');
  process.exit(1);
}

// Initialisation du client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Initialisation des collections
client.commands = new Collection();

// Gestion des erreurs et avertissements
client.on('error', error => {
  console.error('❌ Discord client error:', error);
});

client.on('warn', warning => {
  console.warn('⚠️ Discord client warning:', warning);
});

process.on('unhandledRejection', error => {
  console.error('❌ Unhandled promise rejection:', error);
});

// Fonction principale pour démarrer le bot
async function startBot() {
  try {
    // Connexion à la base de données
    console.log('🔄 Tentative de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie.');

    // Synchronisation avec la base de données (optionnel, si vous avez des modèles)
    await sequelize.sync({ alter: true });
    console.log('🔄 Synchronisation avec la base de données réussie.');

    // Chargement des handlers
    console.log('🔄 Chargement des handlers...');
    loadHandlers(client);

    // Déploiement des commandes
    console.log('🔄 Déploiement automatique des commandes...');
    await deploy();
    console.log('✅ Commandes déployées avec succès !');

    // Connexion du bot à Discord
    await client.login(process.env.DISCORD_TOKEN);
    console.log('🤖 Bot connecté avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du bot:', error);
    process.exit(1);
  }
}

// Démarrage du bot
startBot();
