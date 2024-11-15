const { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { TicketManager } = require('../functions/ticket/ticketManager');

module.exports = {
  customId: 'support-menu',
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { guild, user } = interaction;
    const category = interaction.values[0];
    
    const config = await TicketManager.getTicketConfig(guild.id);

    if (!config) {
      return interaction.editReply({
        content: '❌ Le système de tickets n\'est pas configuré.',
        ephemeral: true
      });
    }

    const activeTickets = await TicketManager.getUserActiveTickets(guild.id, user.id);
    if (activeTickets >= config.maxTicketsPerUser) {
      await interaction.editReply({
        content: `⚠️ Vous ne pouvez pas avoir plus de ${config.maxTicketsPerUser} tickets ouverts simultanément.`,
        ephemeral: true
      });
      
      // Reset le menu
      await interaction.message.edit({
        components: [interaction.message.components[0]]
      });
      return;
    }

    try {
      const supportRoles = Array.isArray(config.supportRoles) ? config.supportRoles : [config.supportRoles];

      const ticketChannel = await guild.channels.create({
        name: `${category.split('_')[1]}-${user.username}`,
        type: ChannelType.GuildText,
        parent: config.ticketCategory,
        topic: `Ticket de ${user.id}`,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ['ViewChannel'],
          },
          {
            id: user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
          },
          ...supportRoles.map(roleId => ({
            id: roleId,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages'],
          })),
        ],
      });

      await TicketManager.createTicket(ticketChannel.id, guild.id, user.id);

      const ticketEmbed = new EmbedBuilder()
        .setTitle('🎟️ Nouveau Ticket')
        .setDescription([
          `Bonjour ${user}, 👋`,
          `\nCatégorie: **${category.split('_')[1]}**`,
          `\nUn membre de l'équipe vous assistera bientôt.`,
          `\n📝 Veuillez décrire votre demande en détail.`
        ].join('\n'))
        .setColor('#2b2d31')
        .setTimestamp();

      // Envoi du message initial avec les boutons
      await ticketChannel.send({
        content: `${user} | ${supportRoles.map(role => `<@&${role}>`).join(' ')}`,
        embeds: [ticketEmbed],
        components: [TicketManager.getTicketButtons()]
      });

      await interaction.editReply({
        content: `✅ Votre ticket a été créé : ${ticketChannel}`,
        ephemeral: true
      });

      // Reset le menu de sélection
      await interaction.message.edit({
        components: [interaction.message.components[0]]
      });

    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);
      await interaction.editReply({
        content: '❌ Une erreur est survenue lors de la création du ticket.',
        ephemeral: true
      });
      
      // Reset le menu en cas d'erreur
      await interaction.message.edit({
        components: [interaction.message.components[0]]
      });
    }
  },
};