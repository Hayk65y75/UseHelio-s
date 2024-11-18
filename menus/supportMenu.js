const { 
  ChannelType, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const { TicketManager } = require('../functions/ticket/ticketManager');

module.exports = {
  customId: 'support-menu',
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { guild, user } = interaction;
    const category = interaction.values[0];

    // Vérification de la configuration du système de tickets
    const config = await TicketManager.getTicketConfig(guild.id);
    if (!config) {
      return interaction.editReply({
        content: '❌ Le système de tickets n\'est pas configuré. Utilisez `/ticket-setup` pour configurer le système.',
        ephemeral: true,
      });
    }

    // Vérification de la catégorie des tickets
    if (!config.ticketCategory) {
      return interaction.editReply({
        content: '❌ Aucune catégorie de tickets n\'a été configurée. Assurez-vous de configurer une catégorie avec `/ticket-setup`.',
        ephemeral: true,
      });
    }

    // Vérification du nombre maximum de tickets par utilisateur
    const activeTickets = await TicketManager.getUserActiveTickets(guild.id, user.id);
    if (activeTickets >= config.maxTicketsPerUser) {
      await interaction.editReply({
        content: `⚠️ Vous avez atteint la limite de ${config.maxTicketsPerUser} tickets ouverts simultanément.`,
        ephemeral: true,
      });

      // Reset le menu en cas d'erreur
      await interaction.message.edit({
        components: [interaction.message.components[0]],
      });
      return;
    }

    try {
      // Vérification des rôles support
      const supportRoles = Array.isArray(config.supportRoles) ? config.supportRoles : [config.supportRoles];
      if (!supportRoles.length) {
        return interaction.editReply({
          content: '❌ Aucun rôle support n\'a été configuré. Veuillez configurer des rôles support avec `/ticket-setup`.',
          ephemeral: true,
        });
      }

      // Création du salon de ticket
      const ticketChannel = await guild.channels.create({
        name: `${category.split('_')[1]}-${user.username}`,
        type: ChannelType.GuildText,
        parent: config.ticketCategory, // Assurez-vous que la catégorie est valide
        topic: `Ticket créé par ${user.tag} (${user.id})`,
        permissionOverwrites: [
          {
            id: guild.id, // Tout le serveur
            deny: ['ViewChannel'],
          },
          {
            id: user.id, // Utilisateur qui a créé le ticket
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
          },
          ...supportRoles.map(roleId => ({
            id: roleId, // Rôles support
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages'],
          })),
        ],
      });

      // Enregistrement du ticket dans la base de données
      await TicketManager.createTicket(ticketChannel.id, guild.id, user.id);

      // Création d'un embed pour le ticket
      const ticketEmbed = new EmbedBuilder()
        .setTitle('🎟️ Nouveau Ticket')
        .setDescription([
          `Bonjour ${user}, 👋`,
          `\nCatégorie: **${category.split('_')[1]}**`,
          `\nUn membre de l'équipe vous assistera bientôt.`,
          `\n📝 Veuillez décrire votre demande en détail.`,
        ].join('\n'))
        .setColor('#2b2d31')
        .setTimestamp();

      // Envoi du message initial avec les boutons
      await ticketChannel.send({
        content: `${user} | ${supportRoles.map(role => `<@&${role}>`).join(' ')}`,
        embeds: [ticketEmbed],
        components: [TicketManager.getTicketButtons()],
      });

      // Réponse à l'utilisateur
      await interaction.editReply({
        content: `✅ Votre ticket a été créé : ${ticketChannel}`,
        ephemeral: true,
      });

      // Reset le menu de sélection après la création du ticket
      await interaction.message.edit({
        components: [interaction.message.components[0]],
      });

    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);

      // Gestion des erreurs lors de la création du ticket
      await interaction.editReply({
        content: '❌ Une erreur est survenue lors de la création du ticket. Veuillez réessayer ou contacter un administrateur.',
        ephemeral: true,
      });

      // Reset le menu en cas d'erreur
      await interaction.message.edit({
        components: [interaction.message.components[0]],
      });
    }
  },
};
