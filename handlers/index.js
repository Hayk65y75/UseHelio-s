const { loadCommands } = require('./commandHandler');
const { loadEvents } = require('./eventHandler');
const { loadButtons } = require('./buttonHandler');
const { loadMenus } = require('./menuHandler');

function loadHandlers(client) {
  loadCommands(client);
  loadEvents(client);
  loadButtons(client);
  loadMenus(client);
}

module.exports = { loadHandlers };