const { loadHandlers } = require('../handlers');
const { deploy } = require('./deploy');

function validateEnvironment() {
  if (!process.env.DISCORD_TOKEN) {
    console.error('Error: DISCORD_TOKEN is required in .env file');
    process.exit(1);
  }

  if (!process.env.CLIENT_ID) {
    console.error('Error: CLIENT_ID is required in .env file');
    process.exit(1);
  }
}

function setupErrorHandlers(client) {
  client.on('error', error => {
    console.error('Discord client error:', error);
  });

  client.on('warn', warning => {
    console.warn('Discord client warning:', warning);
  });

  process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
  });
}

function displayLoadingStats(client) {
  console.log('\n📊 Statistiques de chargement:');
  console.log(`👉 ${client.commandStats.total} commandes chargées`);
  console.log(`👉 ${client.commandStats.dev} commandes dev chargées`);
  console.log(`👉 ${client.buttons.size} boutons chargés`);
  console.log(`👉 ${client.menus.size} menus chargés`);
  if (client.commandStats.failed.length > 0) {
    console.log(`❌ ${client.commandStats.failed.length} commandes non chargées:`);
    client.commandStats.failed.forEach(cmd => console.log(`   - ${cmd}`));
  }
}

async function initializeBot(client) {
  try {
    validateEnvironment();
    setupErrorHandlers(client);
    
    loadHandlers(client);
    displayLoadingStats(client);

    console.log('\n🔄 Déploiement automatique des commandes...');
    await deploy();
    console.log('✅ Commandes déployées avec succès !');

    await client.login(process.env.DISCORD_TOKEN);
    console.log('🤖 Bot connecté avec succès !');
  } catch (error) {
    console.error('Erreur lors du démarrage du bot:', error);
    process.exit(1);
  }
}

module.exports = { initializeBot };