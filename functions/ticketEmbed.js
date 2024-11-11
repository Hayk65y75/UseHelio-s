const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

// Fonction pour créer et renvoyer l'embed de ticket
function createTicketEmbed() {
  const embed = new EmbedBuilder()
    .setColor(0x2F3136)
    .setTitle('Support')
    .setDescription('Veuillez sélectionner une catégorie pour créer un ticket :')
    .addFields(
      { name: '💼 Aide', value: 'Besoin d\'aide pour un problème ?', inline: true },
      { name: '🤝 Partenariat', value: 'Demande de partenariat', inline: true },
      { name: '🛒 Achat', value: 'Questions sur les achats', inline: true },
      { name: '📥 Recrutement', value: 'Intéressé à rejoindre notre équipe ?', inline: true }
    )
    .setThumbnail('https://cdn.discordapp.com/attachments/970694097415340133/1295494458804142211/Picsart_24-10-14_23-10-28-265.png?ex=67331bfc&is=6731ca7c&hm=e3dedef25f843250ab3ad0b0fbe198fc6015ac85bf2d4903fef2dafa7b0fd5dd&') 
    .setFooter({ text: "Helio's Use" })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('ticket_category')
      .setPlaceholder('Sélectionnez une catégorie de ticket')
      .addOptions([
        {
          label: 'Aide',
          description: 'Pour toute aide générale',
          value: 'help',
          emoji: '💼',
        },
        {
          label: 'Partenariat',
          description: 'Pour demander un partenariat',
          value: 'partnership',
          emoji: '🤝',
        },
        {
          label: 'Achat',
          description: 'Questions sur les achats',
          value: 'purchase',
          emoji: '🛒',
        },
        {
          label: 'Recrutement',
          description: 'Rejoindre notre équipe',
          value: 'recruitment',
          emoji: '📥',
        },
      ])
  );

  return { embed, row };
}

module.exports = { createTicketEmbed };
