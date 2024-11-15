const fs = require('fs');
const path = require('path');

function loadCommands(client) {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFolders = fs.readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(commandsPath, folder))
      .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      try {
        const command = require(path.join(commandsPath, folder, file));
        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
          client.commandStats.total++;
          if (folder === 'dev') {
            client.commandStats.dev++;
          }
        } else {
          client.commandStats.failed.push(file);
        }
      } catch (error) {
        client.commandStats.failed.push(file);
        console.error(`Erreur lors du chargement de ${file}:`, error);
      }
    }
  }
}

module.exports = { loadCommands };