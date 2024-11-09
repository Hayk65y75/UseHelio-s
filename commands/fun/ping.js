const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  dev: true, // La commande sera uniquement disponible sur le serveur de développement
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Affiche la latence du bot'),

  async execute(interaction) {
    const sent = await interaction.reply({ 
      content: 'Calcul de la latence...', 
      fetchReply: true 
    });
        
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);
        
    await interaction.editReply(
      `🏓 Pong!\n` +
      `📊 Latence: \`${latency}ms\`\n` +
      `🌐 Latence API: \`${apiLatency}ms\``
    );
  },
};