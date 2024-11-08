const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannit un utilisateur du serveur.')
    .addUserOption(option => 
      option.setName('utilisateur')
        .setDescription('L’utilisateur à bannir')
        .setRequired(true)
    ),
  async execute(interaction) {
    const utilisateur = interaction.options.getUser('utilisateur');
    const membre = interaction.guild.members.cache.get(utilisateur.id);

    // Vérifie si l'utilisateur a les permissions pour bannir
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({
        content: "Vous n'avez pas la permission de bannir des membres.",
        ephemeral: true,
      });
    }

    // Vérifie si le membre existe et est bannissable
    if (!membre) {
      return interaction.reply({ content: "Cet utilisateur n'est pas dans ce serveur.", ephemeral: true });
    }
    
    if (!membre.bannable) {
      return interaction.reply({ content: "Je ne peux pas bannir cet utilisateur.", ephemeral: true });
    }

    // Ban l'utilisateur
    try {
      await membre.ban();
      return interaction.reply({ content: `${utilisateur.tag} a été banni avec succès !` });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: "Une erreur est survenue en essayant de bannir cet utilisateur.", ephemeral: true });
    }
  },
};
