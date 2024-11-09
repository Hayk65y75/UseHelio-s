const { REST, Routes } = require('discord.js');

async function deployCommands(commands, token, clientId, devGuildId) {
  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('Début du déploiement des commandes...');

    // Déployer toutes les commandes
    if (commands.global.length > 0) {
      console.log(`Déploiement de ${commands.global.length} commandes globales...`);
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands.global }
      );
    }

    // Déployer les commandes dev si DEV_GUILD_ID est défini
    if (commands.dev.length > 0 && devGuildId) {
      console.log(`Déploiement de ${commands.dev.length} commandes de développement...`);
      await rest.put(
        Routes.applicationGuildCommands(clientId, devGuildId),
        { body: commands.dev }
      );
    }

    console.log('Déploiement des commandes terminé avec succès !');
  } catch (error) {
    console.error('Erreur lors du déploiement:', error);
    throw error;
  }
}

module.exports = { deployCommands };