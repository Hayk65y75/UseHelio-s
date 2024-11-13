const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Affiche le menu de création de tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Support')
      .setDescription('Veuillez sélectionner une catégorie pour créer un ticket :')
      .setColor('#2b2d31');

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('support-menu')
      .setPlaceholder('Sélectionnez une catégorie de ticket')
      .addOptions([
        {
          label: 'Aide',
          description: 'Obtenir de l\'aide pour un problème.',
          value: 'ticket_aide',
          emoji: '💡',
        },
        {
          label: 'Partenariat',
          description: 'Demande de partenariat.',
          value: 'ticket_partenariat',
          emoji: '🤝',
        },
        {
          label: 'Achat',
          description: 'Informations sur les achats.',
          value: 'ticket_achat',
          emoji: '🛒',
        },
        {
          label: 'Recrutement',
          description: 'Postuler pour un rôle dans l\'équipe.',
          value: 'ticket_recrutement',
          emoji: '📋',
        },
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  },
};
