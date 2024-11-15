const { DataTypes } = require('sequelize');
const { sequelize } = require('../functions/db');

const Ticket = sequelize.define('Ticket', {
  channelId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  guildId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('OPEN', 'CLAIMED', 'CLOSED'),
    defaultValue: 'OPEN'
  },
  claimedBy: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Ticket;