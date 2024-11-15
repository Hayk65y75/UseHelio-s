const fs = require('fs');
const path = require('path');

function loadButtons(client) {
  const buttonsPath = path.join(__dirname, '..', 'buttons');
  
  if (!fs.existsSync(buttonsPath)) {
    fs.mkdirSync(buttonsPath);
    return;
  }

  const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

  for (const file of buttonFiles) {
    try {
      const button = require(`../buttons/${file}`);
      if (button.customId && button.execute) {
        client.buttons.set(button.customId, button);
      }
    } catch (error) {
      console.error(`Erreur lors du chargement du bouton ${file}:`, error);
    }
  }
}

module.exports = { loadButtons };