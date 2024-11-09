const { loadCommands } = require('./loadCommands');
const { validateEnvironment } = require('./validateEnvironment');
const { deployCommands } = require('./deployCommands');

async function deploy() {
  try {
    validateEnvironment();
    const commands = await loadCommands();
    
    const result = await deployCommands(
      commands,
      process.env.DISCORD_TOKEN,
      process.env.CLIENT_ID,
      process.env.DEV_GUILD_ID
    );

    return result;
  } catch (error) {
    console.error('Erreur lors du déploiement:', error);
    throw error;
  }
}

module.exports = { deploy };