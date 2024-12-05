const { loadCommands } = require('./commandHandler');
const { loadEvents } = require('./eventHandler');

function loadHandlers(client) {
  loadCommands(client);
  loadEvents(client);
}

module.exports = { loadHandlers };