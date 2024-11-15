const { TicketManager } = require('../functions/ticket/ticketManager');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  customId: 'close-ticket',
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { guild, channel, user } = interaction;
    const config = await TicketManager.getTicketConfig(guild.id);

    if (!config) {
      return interaction.editReply({
        content: '❌ Configuration du système de tickets introuvable.',
        ephemeral: true
      });
    }

    try {
      const ticket = await TicketManager.getTicket(channel.id);
      if (!ticket || ticket.status === 'CLOSED') {
        return interaction.editReply({
          content: '⚠️ Ce ticket est déjà fermé ou n\'existe plus.',
          ephemeral: true
        });
      }

      const messages = await channel.messages.fetch();
      let transcript = `Transcript du ticket ${channel.name}\n`;
      transcript += `Créé le: ${channel.createdAt}\n\n`;

      messages.reverse().forEach(msg => {
        transcript += `[${msg.createdAt.toLocaleString()}] ${msg.author.tag}: ${msg.content}\n`;
      });

      const transcriptChannel = interaction.guild.channels.cache.get(config.transcriptChannel);
      if (transcriptChannel) {
        const transcriptEmbed = new EmbedBuilder()
          .setTitle('📄 Transcript de ticket')
          .setDescription(`Ticket fermé par ${user}`)
          .setColor('#2b2d31')
          .setTimestamp();

        await transcriptChannel.send({
          embeds: [transcriptEmbed],
          files: [{
            attachment: Buffer.from(transcript),
            name: `transcript-${channel.id}.txt`
          }]
        });
      }

      const closeEmbed = new EmbedBuilder()
        .setTitle('🔒 Fermeture du ticket')
        .setDescription(`Le ticket sera fermé dans ${config.closeTimeout / 1000} secondes.`)
        .setColor('#FEE75C')
        .setTimestamp();

      await interaction.editReply({ embeds: [closeEmbed] });

      await TicketManager.closeTicket(channel.id);
      setTimeout(async () => {
        try {
          await channel.delete();
        } catch (error) {
          console.error('Erreur lors de la suppression du ticket:', error);
        }
      }, config.closeTimeout);

    } catch (error) {
      console.error('Erreur lors de la fermeture du ticket:', error);
      await interaction.editReply({
        content: '❌ Une erreur est survenue lors de la fermeture du ticket.',
        ephemeral: true
      });
    }
  },
};