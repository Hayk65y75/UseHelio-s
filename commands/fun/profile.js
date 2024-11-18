// commands/utilities/profile.js
const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Affiche ou crée le profil d’un utilisateur'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;

    db.query('SELECT * FROM profiles WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération du profil:', err);
        return interaction.reply('❌ Une erreur est survenue lors de la récupération de votre profil.');
      }

      if (results.length > 0) {
        // Si un profil existe déjà, l'afficher
        const profile = results[0];
        return interaction.reply(`👤 **Profil de ${username}**\nPoints: ${profile.points}`);
      } else {
        // Si le profil n'existe pas, le créer
        db.query(
          'INSERT INTO profiles (user_id, username, points) VALUES (?, ?, ?)',
          [userId, username, 0],
          (err) => {
            if (err) {
              console.error('Erreur lors de la création du profil:', err);
              return interaction.reply('❌ Une erreur est survenue lors de la création de votre profil.');
            }
            return interaction.reply(`👤 **Profil créé pour ${username} !**\nPoints: 0`);
          }
        );
      }
    });
  }
};
