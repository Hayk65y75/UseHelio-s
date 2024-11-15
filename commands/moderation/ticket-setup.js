const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const TicketConfig = require('../../models/ticketConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Configure le système de tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option.setName('category')
        .setDescription('Catégorie des tickets')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('transcript')
        .setDescription('Salon des transcriptions')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('support_role')
        .setDescription('Rôle de support')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('max_tickets')
        .setDescription('Nombre maximum de tickets par utilisateur')
        .setMinValue(1)
        .setMaxValue(5))
    .addIntegerOption(option =>
      option.setName('cooldown')
        .setDescription('Cooldown en minutes')
        .setMinValue(1)
        .setMaxValue(60)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const category = interaction.options.getChannel('category');
      const transcript = interaction.options.getChannel('transcript');
      const supportRole = interaction.options.getRole('support_role');
      const maxTickets = interaction.options.getInteger('max_tickets') || 2;
      const cooldown = (interaction.options.getInteger('cooldown') || 5) * 60 * 1000;

      if (category.type !== ChannelType.GuildCategory) {
        return interaction.editReply({
          content: '❌ Le canal sélectionné pour la catégorie doit être une catégorie.',
          ephemeral: true
        });
      }

      if (transcript.type !== ChannelType.GuildText) {
        return interaction.editReply({
          content: '❌ Le canal sélectionné pour les transcriptions doit être un salon textuel.',
          ephemeral: true
        });
      }

      const [config] = await TicketConfig.upsert({
        guildId: interaction.guildId,
        ticketCategory: category.id,
        transcriptChannel: transcript.id,
        supportRoles: [supportRole.id],
        maxTicketsPerUser: maxTickets,
        cooldown: cooldown,
        closeTimeout: 5000
      });

      // Met à jour le cache
      if (!global.ticketConfigs) {
        global.ticketConfigs = new Map();
      }
      global.ticketConfigs.set(interaction.guildId, config);

      const embed = new EmbedBuilder()
        .setTitle('✅ Configuration des tickets')
        .setDescription('La configuration a été mise à jour avec succès!')
        .addFields(
          { name: 'Catégorie', value: `<#${category.id}>`, inline: true },
          { name: 'Transcriptions', value: `<#${transcript.id}>`, inline: true },
          { name: 'Rôle Support', value: `<@&${supportRole.id}>`, inline: true },
          { name: 'Max Tickets', value: maxTickets.toString(), inline: true },
          { name: 'Cooldown', value: `${cooldown/60000} minutes`, inline: true }
        )
        .setColor('#57F287')
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur de configuration:', error);
      await interaction.editReply({
        content: '❌ Une erreur est survenue lors de la configuration.',
        ephemeral: true
      });
    }
  }
};