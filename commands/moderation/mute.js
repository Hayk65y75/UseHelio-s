const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Applique un timeout à un utilisateur pour une durée spécifique.')
    .addUserOption(option =>
      option
        .setName('utilisateur')
        .setDescription('L\'utilisateur à mute')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('durée')
        .setDescription('Durée du mute (ex: 10m, 1h, 1d)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('raison')
        .setDescription('Raison du mute')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // Réservé aux modérateurs

  async execute(interaction) {
    const target = interaction.options.getUser('utilisateur');
    const member = interaction.guild.members.cache.get(target.id);
    const duration = interaction.options.getString('durée');
    const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';

    // Convertir la durée en millisecondes
    const timeoutDuration = ms(duration);
    if (!timeoutDuration) {
      return interaction.reply({
        content: 'Durée invalide. Veuillez spécifier une durée valide, par exemple "10m", "1h", "1d".',
        ephemeral: true
      });
    }

    try {
      // Appliquer le timeout
      await member.timeout(timeoutDuration, reason);
      await interaction.reply({
        content: `✅ ${target.username} a été muté pour ${duration}. Raison : ${reason}`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'application du mute:', error);
      await interaction.reply({
        content: '❌ Impossible de mute cet utilisateur. Vérifie mes permissions.',
        ephemeral: true
      });
    }
  },
};
