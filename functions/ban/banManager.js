const TempBan = require('../models/TempBan');

class BanManager {
  static async scheduleBan(guildId, userId, duration, reason) {
    const unbanDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    
    await TempBan.create({
      userId,
      guildId,
      unbanDate,
      reason
    });
  }

  static async checkBans(client) {
    try {
      const now = new Date();
      const expiredBans = await TempBan.findAll({
        where: {
          unbanDate: {
            [Op.lte]: now
          }
        }
      });

      for (const ban of expiredBans) {
        try {
          const guild = await client.guilds.fetch(ban.guildId);
          await guild.members.unban(ban.userId, 'Fin du bannissement temporaire');
          await ban.destroy();
        } catch (error) {
          console.error(`Erreur lors du débannissement de ${ban.userId} dans ${ban.guildId}:`, error);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des bannissements:', error);
    }
  }
}

module.exports = BanManager;
