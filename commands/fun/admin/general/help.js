const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche la liste des commandes disponibles.'),
  async execute(interaction) {
    const commandes = interaction.client.commands.map(cmd => `\`/${cmd.data.name}\` : ${cmd.data.description}`).join('\n');

    await interaction.reply({
      content: `Voici la liste des commandes disponibles :\n\n${commandes}`,
      ephemeral: true,
    });
  },
};
