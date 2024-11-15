const fs = require('fs');
const path = require('path');

function loadMenus(client) {
  const menusPath = path.join(__dirname, '..', 'menus');
  
  if (!fs.existsSync(menusPath)) {
    fs.mkdirSync(menusPath);
    return;
  }

  const menuFiles = fs.readdirSync(menusPath).filter(file => file.endsWith('.js'));

  for (const file of menuFiles) {
    try {
      const menu = require(`../menus/${file}`);
      if (menu.customId && menu.execute) {
        client.menus.set(menu.customId, menu);
      }
    } catch (error) {
      console.error(`Erreur lors du chargement du menu ${file}:`, error);
    }
  }
}

module.exports = { loadMenus };