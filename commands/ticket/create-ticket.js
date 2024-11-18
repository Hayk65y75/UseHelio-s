const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { TicketManager } = require('../../functions/ticket/ticketManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-ticket')
    .setDescription('Affiche le menu pour créer un ticket.'),

  async execute(interaction) {
    const config = await TicketManager.getTicketConfig(interaction.guildId);

    if (!config) {
      return interaction.reply({
        content: '❌ Le système de tickets n\'est pas configuré. Un administrateur doit d\'abord utiliser `/ticket-setup`.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🛠️ Création de Ticket')
      .setDescription('Sélectionnez le type de ticket que vous souhaitez ouvrir ci-dessous.')
      .setColor('#2b2d31');

    const menu = new StringSelectMenuBuilder()
      .setCustomId('support-menu')
      .setPlaceholder('📂 Choisissez une catégorie de ticket')
      .addOptions([
        { label: 'Recrutement', description: 'Ouvrir un ticket pour le recrutement', emoji: '📝', value: 'ticket_recrutement' },
        { label: 'Achat', description: 'Ouvrir un ticket pour un achat', emoji: '💸', value: 'ticket_achat' },
        { label: 'Support', description: 'Ouvrir un ticket pour une aide technique', emoji: '🔧', value: 'ticket_support' }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
