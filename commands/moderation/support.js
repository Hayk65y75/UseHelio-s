const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Ouvre le menu de support')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🛠️ Support')
      .setDescription('Sélectionnez le type de ticket que vous souhaitez ouvrir ci-dessous.')
      .setThumbnail('https://cdn.discordapp.com/attachments/970694097415340133/1295494458804142211/Picsart_24-10-14_23-10-28-265.png?ex=6735befc&is=67346d7c&hm=6acc9c0e00fec0179376f30d3b6e88ec93f9b8058c93dd135289b813f62ad28f&')
      .setColor('Purple');
    
    const supportMenu = new StringSelectMenuBuilder()
      .setCustomId('support-menu')
      .setPlaceholder('📂 Choisissez une catégorie de support')
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
