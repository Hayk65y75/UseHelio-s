const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Affiche la latence d\'Helio'),

  async execute(interaction) {
    const sent = await interaction.reply({ 
      content: 'Calcul de la latence...', 
      fetchReply: true 
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    let color;
    if (latency <= 60) {
      color = 0x57F287; // Vert
    } else if (latency <= 140) {
      color = 0xFEE75C; // Jaune
    } else {
      color = 0xED4245; // Rouge
    }

    const embed = new EmbedBuilder()
      .setTitle('🏓 Le Ping d\'Helio')
      .setColor(color)
      .setThumbnail('https://media.giphy.com/media/MaXOUjkV73aO4/giphy.gif?cid=790b76113iajoc92yyaafpy1e34ctnk472d4xv364bpgud80&ep=v1_gifs_search&rid=giphy.gif&ct=g')
      .addFields(
        { 
          name: '📶 Latence du Bot', 
          value: `\`${latency}ms\``, 
          inline: true 
        },
        { 
          name: '🌐 Latence de l\'API', 
          value: `\`${apiLatency}ms\``, 
          inline: true 
        }
      )
      .setTimestamp();

    await interaction.editReply({ 
      content: '', 
      embeds: [embed] 
    });
  },
};
