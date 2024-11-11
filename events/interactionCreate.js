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
                  content: 'Une erreur est survenue lors de l\'exécution de cette commande.',
                  ephemeral: true
              };
              if (interaction.replied || interaction.deferred) {
                  await interaction.followUp(errorMessage);
              } else {
                  await interaction.reply(errorMessage);
              }
          }
      }

      // Gère les interactions du menu de sélection pour les tickets
      if (interaction.isSelectMenu() && interaction.customId === 'ticket_category') {
          const category = interaction.values[0];
          const channelName = `ticket-${interaction.user.username}-${category}`;

          // Vérifie si un ticket existe déjà
          const existingChannel = interaction.guild.channels.cache.find(channel => 
            channel.name === channelName
          );
          if (existingChannel) {
              return interaction.reply({
                  content: '❌ Vous avez déjà un ticket ouvert pour cette catégorie.',
                  ephemeral: true
              });
          }

          // Crée un nouveau salon de ticket
          const ticketChannel = await interaction.guild.channels.create({
              name: channelName,
              type: 'GUILD_TEXT',
              topic: `Ticket pour ${interaction.user.username} - Catégorie: ${category}`,
              permissionOverwrites: [
                  {
                      id: interaction.guild.roles.everyone,
                      deny: ['VIEW_CHANNEL'],
                  },
                  {
                      id: interaction.user.id,
                      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                  },
              ],
          });

          await ticketChannel.send({
              content: `Bonjour ${interaction.user}, notre équipe va vous assister sous peu.`,
          });

          await interaction.reply({
              content: `✅ Votre ticket a été créé: ${ticketChannel}`,
              ephemeral: true
          });
      }
  },
};
