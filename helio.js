require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadHandlers } = require('./handlers');
const { deploy } = require('./functions/deploy');
const { createTicketEmbed } = require('./functions/ticketEmbed'); // Importe la fonction pour créer l'embed de ticket

// Vérifie la présence des variables d'environnement
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
    GatewayIntentBits.MessageContent,
  ]
});

// Initialiser les collections
client.commands = new Collection();

// Gestion des erreurs
client.on('error', error => console.error('Discord client error:', error));
client.on('warn', warning => console.warn('Discord client warning:', warning));

process.on('unhandledRejection', error => console.error('Unhandled promise rejection:', error));

async function startBot() {
  try {
    // Charger tous les handlers
    loadHandlers(client);

    // Déploie les commandes après le lancement du bot
    console.log('🔄 Déploiement automatique des commandes...');
    await deploy();
    console.log('✅ Commandes déployées avec succès !');

    await client.login(process.env.DISCORD_TOKEN);
    console.log('🤖 Bot connecté avec succès !');

    // Envoie l'embed de ticket dans le channel de support spécifié
    const channelId = process.env.SUPPORT_CHANNEL_ID;
    const channel = client.channels.cache.get(channelId);

    if (channel) {
      const { embed, row } = createTicketEmbed();
      channel.send({ embeds: [embed], components: [row] });
    } else {
      console.error('Channel de support non trouvé. Vérifie l\'ID.');
    }
  } catch (error) {
    console.error('Erreur lors du démarrage du bot:', error);
    process.exit(1);
  }
}

startBot();
