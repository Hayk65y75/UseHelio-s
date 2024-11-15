require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { initializeBot } = require('./functions/initialize');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

client.commands = new Collection();
client.buttons = new Collection();
client.menus = new Collection();
client.commandStats = {
  total: 0,
  dev: 0,
  failed: []
};

initializeBot(client);