module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        await command.execute(interaction, client);
      }
      
      if (interaction.isStringSelectMenu()) {
        const menu = client.menus.get(interaction.customId);
        if (!menu) return;

        await menu.execute(interaction, client);
      }
      
      if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);
        if (!button) return;

        await button.execute(interaction, client);
      }
    } catch (error) {
      console.error('Error in interactionCreate:', error);
      const errorMessage = {
        content: '❌ Une erreur est survenue lors de l\'exécution de cette interaction.',
        ephemeral: true
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  },
};