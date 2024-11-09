const fs = require('fs');
const path = require('path');

async function loadCommands() {
  const commands = {
    global: [],
    dev: []
  };

  const commandsPath = path.join(__dirname, '../../commands');
  const commandFolders = fs.readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(path.join(folderPath, file));
      
      if (!command.data) {
        console.warn(`[WARNING] Command ${file} is missing required "data" property`);
        continue;
      }

      // Vérifier si c'est une commande de développement
      if (command.dev && process.env.DEV_GUILD_ID) {
        commands.dev.push(command.data.toJSON());
      } else {
        commands.global.push(command.data.toJSON());
      }
    }
  }

  // Vérifier les doublons
  const allCommandNames = [...commands.global, ...commands.dev].map(cmd => cmd.name);
  const duplicates = allCommandNames.filter((name, index) => 
    allCommandNames.indexOf(name) !== index
  );

  if (duplicates.length > 0) {
    throw new Error(`Commandes en double détectées: ${duplicates.join(', ')}`);
  }

  return commands;
}

module.exports = { loadCommands };