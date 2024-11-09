const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trophies')
    .setDescription('Affiche les statistiques des membres du serveur'),

  async execute(interaction) {
    const { guild } = interaction;

    try {
      // Utilisation de cache pour éviter un fetch complet
      const totalMembers = guild.memberCount;
      const onlineMembers = guild.members.cache.filter(
        member => member.presence && member.presence.status !== 'offline'
      ).size;
      const offlineMembers = totalMembers - onlineMembers;

      // Créer l'embed
      const embed = new EmbedBuilder()
        .setColor(0x2F3136) // Couleur de fond similaire à l'image
        .setTitle(`${guild.name} ➔ Statistiques`)
        .addFields(
          { name: '🌍 Membres', value: `${totalMembers}`, inline: true },
          { name: '💚 En Ligne', value: `${onlineMembers}`, inline: true },
          { name: '🔴 Hors Ligne', value: `${offlineMembers}`, inline: true }
        )
        .setThumbnail('https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG5jcjJucW01ejY2bTkwbGppemFnc2N0MnU3amNlaXdsN2M5cHlnMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ho6dPXSABg2wGcuHEj/giphy.webp')

      // Répondre avec l'embed
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur lors de l\'exécution de la commande /trophies:', error);
      await interaction.reply({
        content: '❌ Une erreur est survenue lors de l\'exécution de cette commande.',
        ephemeral: true
      });
    }
  },
};
