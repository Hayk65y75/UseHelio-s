const { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);
        
        const errorMessage = {
          content: '❌ Une erreur est survenue lors de l\'exécution de cette commande.',
          ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      }
    }

    
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'support-menu') {
        const category = interaction.values[0];
        const user = interaction.user;

        
        const existingTicket = interaction.guild.channels.cache.find(
          channel =>
            channel.parentId === '1295124833784430686' && 
            channel.topic === `Ticket de ${user.id}` 
        );

        if (existingTicket) {
          await interaction.reply({
            content: '⚠️ Vous avez déjà un ticket ouvert. Veuillez fermer votre ticket existant avant d’en créer un autre.',
            ephemeral: true
          });
          return;
        }

        try {
          const ticketChannel = await interaction.guild.channels.create({
            name: `${category.split('_')[1]}-${user.username}`,
            type: ChannelType.GuildText,
            parent: '1295124833784430686', 
            topic: `Ticket de ${user.id}`, 
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: ['ViewChannel'],
              },
              {
                id: user.id,
                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
              },
            ],
          });

          
          const ticketEmbed = new EmbedBuilder()
            .setTitle('🎟️ Ticket Support')
            .setDescription(`Bonjour ${user}, 👋\nVoici votre ticket pour la catégorie : **${category.split('_')[1]}**.\n\nUn membre de l'équipe vous assistera bientôt.`)
            .setColor('#2b2d31')
            .setTimestamp();

        
          const closeButton = new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Fermer le ticket')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒');

          const row = new ActionRowBuilder().addComponents(closeButton);

          await ticketChannel.send({ embeds: [ticketEmbed], components: [row] });
          await interaction.reply({ content: `✅ Votre ticket a été créé : ${ticketChannel}`, ephemeral: true });
        } catch (error) {
          console.error('Erreur lors de la création du ticket:', error);
          await interaction.reply({ content: '❌ Impossible de créer le ticket. Veuillez réessayer.', ephemeral: true });
        }
      }
    }

    
    if (interaction.isButton()) {
      if (interaction.customId === 'close_ticket') {
        const ticketChannel = interaction.channel;

        
        if (interaction.channel.parentId !== '1295124833784430686') {
          return interaction.reply({ content: '🚫 Vous ne pouvez pas fermer ce salon.', ephemeral: true });
        }

        await interaction.reply({ content: '🔒 Le ticket sera fermé dans 5 secondes.', ephemeral: true });

        setTimeout(async () => {
          await ticketChannel.delete().catch(err => console.error('Erreur lors de la suppression du salon:', err));
        }, 5000);
      }
    }
  },
};
