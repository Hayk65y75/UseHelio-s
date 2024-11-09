function validateEnvironment() {
    const requiredVars = {
      DISCORD_TOKEN: 'Token Discord du bot',
      CLIENT_ID: 'ID de l\'application Discord'
    };
  
    const missingVars = [];
  
    for (const [varName, description] of Object.entries(requiredVars)) {
      if (!process.env[varName]) {
        missingVars.push(`${varName} (${description})`);
      }
    }
  
    if (missingVars.length > 0) {
      throw new Error(
        'Variables d\'environnement manquantes:\n' +
        missingVars.map(v => `- ${v}`).join('\n')
      );
    }
  }
  
  module.exports = { validateEnvironment };