require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

// Handlers
const commandHandler = require('./handlers/commandHandler');
const eventHandler = require('./handlers/eventHandler');

// Charger les commandes et événements
commandHandler(client);
eventHandler(client);

// Utilise le token depuis les variables d’environnement
client.login(process.env.DISCORD_TOKEN);
