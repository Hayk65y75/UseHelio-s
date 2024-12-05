const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  dev: true, // La commande sera uniquement disponible sur le serveur de développement
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Affiche la latence du bot et de l\'API Discord'),

  async execute(interaction) {
    // Réponse initiale pour calculer la latence
    const sent = await interaction.reply({ 
      content: 'Calcul de la latence...', 
      fetchReply: true 
    });

    // Calcul des latences
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    // Créer l'embed avec les statistiques
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle('📡 Le Ping d\'Helio') // Titre principal
      .setThumbnail('https://media.giphy.com/media/MaXOUjkV73aO4/giphy.gif?cid=790b76113iajoc92yyaafpy1e34ctnk472d4xv364bpgud80&ep=v1_gifs_search&rid=giphy.gif&ct=g')
      .addFields(
        { name: '📶 Latence du Bot', value: `\`${latency}ms\``, inline: true },
        { name: '🌐 Latence de l\'API', value: `\`${apiLatency}ms\``, inline: true }
      )
      .setFooter({ text: 'Le Ping d\'Helio', iconURL: 'https://cdn.discordapp.com/icons/1293673432013344819/5610ae3543de1d090eb78a578808ed0c.webp' })
      .setTimestamp(); // Ajout de l'heure actuelle

    // Modifier la réponse avec l'embed
    await interaction.editReply({ content: '', embeds: [embed] });
  },
};
