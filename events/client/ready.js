const { Events } = require('discord.js');
const { connectDatabase } = require('../../functions/db');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    try {
      await connectDatabase();
      console.log(`🤖 ${client.user.tag} est prêt !`);
    } catch (error) {
      console.error('❌ Erreur lors du démarrage:', error);
      process.exit(1);
    }
  },
};