const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannit un utilisateur du serveur')
    .addUserOption(option => 
      option.setName('utilisateur')
        .setDescription('L\'utilisateur à bannir')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('La raison du bannissement')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('utilisateur');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie';
    
    try {
      const member = await interaction.guild.members.fetch(target.id);

      if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply({
          content: '❌ Vous ne pouvez pas bannir cet utilisateur car son rôle est supérieur ou égal au vôtre.',
          ephemeral: true
        });
      }

      if (!member.bannable) {
        return interaction.reply({
          content: '❌ Je ne peux pas bannir cet utilisateur. Vérifiez que mon rôle est assez haut dans la hiérarchie.',
          ephemeral: true
        });
      }

      await member.ban({ reason });
      
      return interaction.reply({
        content: `✅ **${target.tag}** a été banni.\n📝 Raison: ${reason}`,
        ephemeral: true
      });
      
    } catch (error) {
      console.error('Erreur lors du bannissement:', error);
      return interaction.reply({
        content: '❌ Une erreur est survenue lors du bannissement.',
        ephemeral: true
      });
    }
  },
};