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

    // Gestion du menu de support
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'support-menu') {
        const category = interaction.values[0];
        const user = interaction.user;

        // Création du ticket
        try {
          const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${user.username}`,
            type: 0, // Type 0 pour les salons texte
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

          await ticketChannel.send(`Bonjour ${user}, voici votre ticket pour la catégorie : **${category.replace('ticket_', '')}**. Un membre de l'équipe vous assistera bientôt.`);
          await interaction.reply({ content: `✅ Votre ticket a été créé : ${ticketChannel}`, ephemeral: true });
        } catch (error) {
          console.error('Erreur lors de la création du ticket:', error);
          await interaction.reply({ content: '❌ Impossible de créer le ticket. Veuillez réessayer.', ephemeral: true });
        }
      }
    }
  },
};
