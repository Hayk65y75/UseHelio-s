require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadHandlers } = require('./handlers');
const { deploy } = require('./functions/deploy');

// sa regarde si ta bien le token ou client_id dans le .env
if (!process.env.DISCORD_TOKEN) {
  console.error('Error: DISCORD_TOKEN is required in .env file');
  process.exit(1);
}

if (!process.env.CLIENT_ID) {
  console.error('Error: CLIENT_ID is required in .env file');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// initialiser les collections
client.commands = new Collection();

// gestion des erreurs
client.on('error', error => {
  console.error('Discord client error:', error);
});

client.on('warn', warning => {
  console.warn('Discord client warning:', warning);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

async function startBot() {
  try {
    // charges tous les handlers
    loadHandlers(client);

    // déploie les commandes après que le bot soit lancé
    console.log('🔄 Déploiement automatique des commandes...');
    await deploy();
    console.log('✅ Commandes déployées avec succès !');

    await client.login(process.env.DISCORD_TOKEN);
    console.log('🤖 Bot connecté avec succès !');
  } catch (error) {
    console.error('Erreur lors du démarrage du bot:', error);
    process.exit(1);
  }
}

startBot();
