const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { TicketManager } = require('../../functions/ticket/ticketManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-ticket')
    .setDescription('Ouvre le menu de création de ticket'),
  
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
      .setThumbnail('https://cdn.discordapp.com/attachments/970694097415340133/1295494458804142211/Picsart_24-10-14_23-10-28-265.png')
      .setColor('Purple');
    
    const supportMenu = new StringSelectMenuBuilder()
      .setCustomId('support-menu')
      .setPlaceholder('📂 Choisissez une catégorie de ticket')
      .addOptions([
        {
          label: 'Recrutement',
          description: 'Ouvrir un ticket pour le recrutement',
          emoji: '📝',
          value: 'ticket_recrutement'
        },
        {
          label: 'Achat',
          description: 'Ouvrir un ticket pour un achat',
          emoji: '💸',
          value: 'ticket_achat'
        },
        {
          label: 'Support/Aide',
          description: 'Ouvrir un ticket pour le Support',
          emoji: '🔧',
          value: 'ticket_support'
        }
      ]);

    const row = new ActionRowBuilder().addComponents(supportMenu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: false 
    });
  }
};