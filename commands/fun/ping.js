const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong! and shows the bot latency.'),

    async execute(interaction) {
        // Envoie une réponse initiale pour calculer la latence
        const sent = await interaction.reply({ content: 'Pong!', fetchReply: true });
        
        // Calcule la latence et édite la réponse pour afficher les informations
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);
        
        await interaction.editReply(`Pong! Latence : ${latency}ms. API Latence : ${apiLatency}ms.`);
    },
};
