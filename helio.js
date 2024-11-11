require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadHandlers } = require('./handlers');
const { deploy } = require('./functions/deploy');

// Vérifie la présence des variables d'environnement
if (!process.env.DISCORD_TOKEN) {
  console.error('Error: DISCORD_TOKEN is required in .env file');
  process.exit(1);
}

if (!process.env.CLIENT_ID) {
  console.error('Error: CLIENT_ID is required in .env file');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Initialiser les collections
client.commands = new Collection();

// Gestion des erreurs
client.on('error', error => {
  console.error('Discord client error:', error);
});

client.on('warn', warning => {
  console.warn('Discord client warning:', warning);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

async function startBot() {
  try {
    // Charger les handlers
    loadHandlers(client);

    // Déploiement des commandes
    console.log('🔄 Déploiement automatique des commandes...');
    await deploy();
    console.log('✅ Commandes déployées avec succès !');

    await client.login(process.env.DISCORD_TOKEN);
    console.log('🤖 Bot connecté avec succès !');

    // Envoie de l'embed de ticket dans le channel de support
    const channelId = process.env.SUPPORT_CHANNEL_ID;
    const channel = client.channels.cache.get(channelId);

    if (channel) {
      console.log(`Channel de support trouvé : ${channel.name}`);
      const { embed, row } = createTicketEmbed();
      channel.send({ embeds: [embed], components: [row] });
    } else {
      console.error('Channel de support non trouvé. Vérifie l\'ID.');
    }
  } catch (error) {
    console.error('Erreur lors du démarrage du bot:', error);
    process.exit(1);
  }
}

// Fonction pour créer l'embed et le bouton pour le ticket
function createTicketEmbed() {
  const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

  const embed = new EmbedBuilder()
    .setTitle("Support")
    .setDescription("Veuillez sélectionner une catégorie pour créer un ticket :")
    .setColor(0x2b2d31)
    .addFields(
      { name: "📘 Aide", value: "Obtenez de l'aide pour vos questions." },
      { name: "🤝 Partenariat", value: "Faites une demande de partenariat." },
      { name: "💰 Achat", value: "Assistance pour vos achats." },
      { name: "📝 Recrutement", value: "Postulez pour rejoindre notre équipe." }
    )
    .setFooter({ text: "Helio's Use" });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('ticket_create')
      .setLabel('Créer un ticket')
      .setStyle(ButtonStyle.Primary)
  );

  return { embed, row };
}

startBot();
