const { Sequelize } = require('sequelize');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../../models/ticket');
const TicketConfig = require('../../models/ticketConfig');

class TicketManager {
  static async createTicket(channelId, guildId, userId) {
    return await Ticket.create({
      channelId,
      guildId,
      userId,
      status: 'OPEN'
    });
  }

  static async getTicket(channelId) {
    return await Ticket.findByPk(channelId);
  }

  static async claimTicket(channelId, staffId) {
    const ticket = await this.getTicket(channelId);
    if (ticket) {
      ticket.status = 'CLAIMED';
      ticket.claimedBy = staffId;
      await ticket.save();
    }
    return ticket;
  }

  static async closeTicket(channelId) {
    const ticket = await this.getTicket(channelId);
    if (ticket) {
      ticket.status = 'CLOSED';
      await ticket.save();
    }
    return ticket;
  }

  static async getUserActiveTickets(guildId, userId) {
    return await Ticket.count({
      where: {
        guildId,
        userId,
        status: ['OPEN', 'CLAIMED']
      }
    });
  }

  static async getTicketConfig(guildId) {
    try {
      // Vérifiez d'abord le cache (pour aller plus vite)
      if (global.ticketConfigs?.has(guildId)) {
        const config = global.ticketConfigs.get(guildId);
        return {
          ...config.dataValues,
          supportRoles: Array.isArray(config.supportRoles) ? config.supportRoles : JSON.parse(config.supportRoles)
        };
      }

      // S'il n'est pas dans le cache, il est récupéré dans la base de données.
      const config = await TicketConfig.findByPk(guildId);
      
      if (config) {
        const parsedConfig = {
          ...config.dataValues,
          supportRoles: Array.isArray(config.supportRoles) ? config.supportRoles : JSON.parse(config.supportRoles)
        };

        // Update cache
        if (!global.ticketConfigs) {
          global.ticketConfigs = new Map();
        }
        global.ticketConfigs.set(guildId, config);

        return parsedConfig;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching ticket config:', error);
      return null;
    }
  }

  static getTicketButtons() {
    return new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('claim-ticket')
          .setLabel('Prendre en charge')
          .setEmoji('🎫')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('close-ticket')
          .setLabel('Fermer')
          .setEmoji('🔒')
          .setStyle(ButtonStyle.Danger)
      );
  }

  static async initializeTicketSystem() {
    try {
      // Initialiser le cache
      if (!global.ticketConfigs) {
        global.ticketConfigs = new Map();
      }
      
      console.log('Ticket system initialized successfully.');
    } catch (error) {
      console.error('Error initializing ticket system:', error);
    }
  }
}

module.exports = { TicketManager };