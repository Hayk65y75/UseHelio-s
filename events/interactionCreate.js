const database = require('./database'); // Import de la base si nécessaire

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      // Exemple : Enregistrement de l'utilisateur dans la base
      if (interaction.user) {
        await database.query(
          'INSERT INTO users (discord_id, username) VALUES (?, ?) ON DUPLICATE KEY UPDATE username = ?',
          {
            replacements: [
              interaction.user.id,
              interaction.user.username,
              interaction.user.username,
            ],
          }
        );
        console.log(`Utilisateur ${interaction.user.username} enregistré.`);
      }

      // Exécution de la commande
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing command ${interaction.commandName}:`, error);

      const errorMessage = {
        content: 'Une erreur est survenue lors de l\'exécution de cette commande.',
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  },
};
