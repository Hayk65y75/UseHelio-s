require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadHandlers } = require('./handlers');
const { deploy } = require('./functions/deploy');
const database = require('./database'); // Import de l'instance Sequelize

// Vérification des variables d'environnement
if (!process.env.DISCORD_TOKEN) {
  console.error('Error: DISCORD_TOKEN is required in .env file');
  process.exit(1);
}

if (!process.env.CLIENT_ID) {
  console.error('Error: CLIENT_ID is required in .env file');
  process.exit(1);
}

// Création du client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Initialisation des collections
client.commands = new Collection();

// Gestion des erreurs
client.on('error', error => {
  console.error('Discord client error:', error);
});

client.on('warn', warning => {
  console.warn('Discord client warning:', warning);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

// Démarrage du bot
async function startBot() {
  try {
    // Charger les handlers
    loadHandlers(client);

    // Déployer les commandes
    console.log('🔄 Déploiement automatique des commandes...');
    await deploy();
    console.log('✅ Commandes déployées avec succès !');

    // Connexion au bot Discord
    await client.login(process.env.DISCORD_TOKEN);
    console.log('🤖 Bot connecté avec succès !');
  } catch (error) {
    console.error('Erreur lors du démarrage du bot:', error);
    process.exit(1);
  }
}

startBot();
