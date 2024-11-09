const fs = require('fs');
const path = require('path');

function loadCommands(client) {
  const commandsPath = path.join(__dirname, '../commands');
  const commandFolders = fs.readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);

      if (!command.data || !command.execute) {
        console.warn(`[WARNING] Command at ${filePath} is missing required "data" or "execute" property`);
        continue;
      }

      command.category = folder;
      
      // Entregistre la commande
      client.commands.set(command.data.name, command);
    }
  }
}

module.exports = { loadCommands };