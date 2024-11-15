const { DataTypes } = require('sequelize');
const { sequelize } = require('../functions/db');

const TicketConfig = sequelize.define('TicketConfig', {
  guildId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  ticketCategory: {
    type: DataTypes.STRING,
    allowNull: false
  },
  transcriptChannel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  supportRoles: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  maxTicketsPerUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  },
  cooldown: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 300000 // 5 minutes
  },
  closeTimeout: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5000 // 5 secondes
  }
});

module.exports = TicketConfig;