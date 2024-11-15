const { TicketManager } = require('../functions/ticket/ticketManager');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  customId: 'claim-ticket',
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { guild, member, channel } = interaction;
    const config = await TicketManager.getTicketConfig(guild.id);

    if (!config) {
      return interaction.editReply({
        content: '❌ Configuration du système de tickets introuvable.',
        ephemeral: true
      });
    }

    const hasRole = config.supportRoles.some(roleId => member.roles.cache.has(roleId));
    if (!hasRole) {
      return interaction.editReply({
        content: '🚫 Vous n\'avez pas la permission de prendre en charge ce ticket.',
        ephemeral: true
      });
    }

    try {
      const ticket = await TicketManager.getTicket(channel.id);
      if (!ticket || ticket.status === 'CLAIMED') {
        return interaction.editReply({
          content: '⚠️ Ce ticket est déjà pris en charge ou n\'existe plus.',
          ephemeral: true
        });
      }

      await TicketManager.claimTicket(channel.id, member.id);
      await channel.setName(`claimed-${channel.name}`);

      const embed = new EmbedBuilder()
        .setTitle('✅ Ticket pris en charge')
        .setDescription(`Ce ticket est maintenant géré par ${member}`)
        .setColor('#57F287')
        .setTimestamp();

      await channel.send({ embeds: [embed] });
      await interaction.editReply({
        content: '✅ Vous avez pris en charge ce ticket.',
        ephemeral: true
      });
    } catch (error) {
      console.error('Erreur lors de la prise en charge du ticket:', error);
      await interaction.editReply({
        content: '❌ Une erreur est survenue lors de la prise en charge du ticket.',
        ephemeral: true
      });
    }
  },
};