const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const BanManager = require('../../utils/banManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannit un utilisateur du serveur')
    .addUserOption(option => 
      option.setName('utilisateur')
        .setDescription('L\'utilisateur à bannir')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('raison')
        .setDescription('La raison du bannissement')
        .setRequired(false)
    )
    .addNumberOption(option =>
      option.setName('duree')
        .setDescription('Durée du bannissement en jours (0 = permanent)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option.setName('supprimer_messages')
        .setDescription('Supprimer les messages de l\'utilisateur?')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('utilisateur');
    const reason = interaction.options.getString('raison') || 'Aucune raison fournie';
    const duration = interaction.options.getNumber('duree') || 0;
    const deleteMessages = interaction.options.getBoolean('supprimer_messages') ?? true;
    
    try {
      const member = await interaction.guild.members.fetch(target.id);

      if (target.id === interaction.user.id) {
        return interaction.reply({
          content: '❌ Vous ne pouvez pas vous bannir vous-même.',
          ephemeral: true
        });
      }

      if (target.id === interaction.client.user.id) {
        return interaction.reply({
          content: '❌ Je ne peux pas me bannir moi-même.',
          ephemeral: true
        });
      }

      if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply({
          content: '❌ Vous ne pouvez pas bannir cet utilisateur car son rôle est supérieur ou égal au vôtre.',
          ephemeral: true
        });
      }

      if (!member.bannable) {
        return interaction.reply({
          content: '❌ Je ne peux pas bannir cet utilisateur. Vérifiez que mon rôle est assez haut dans la hiérarchie.',
          ephemeral: true
        });
      }

      const banEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('🔨 Bannissement')
        .setThumbnail(target.displayAvatarURL())
        .addFields(
          { name: 'Utilisateur banni', value: `${target.tag} (${target.id})` },
          { name: 'Banni par', value: `${interaction.user.tag}` },
          { name: 'Raison', value: reason },
          { name: 'Durée', value: duration === 0 ? 'Permanent' : `${duration} jour(s)` }
        )
        .setTimestamp();

      await member.ban({
        deleteMessageDays: deleteMessages ? 7 : 0,
        reason: `${reason} | Banni par ${interaction.user.tag}`
      });

      if (duration > 0) {
        await BanManager.scheduleBan(
          interaction.guild.id,
          target.id,
          duration,
          reason
        );
      }

      await interaction.reply({ embeds: [banEmbed], ephemeral: false });

      try {
        const dmEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle(`Vous avez été banni de ${interaction.guild.name}`)
          .addFields(
            { name: 'Raison', value: reason },
            { name: 'Durée', value: duration === 0 ? 'Permanent' : `${duration} jour(s)` }
          )
          .setTimestamp();

        await target.send({ embeds: [dmEmbed] });
      } catch (error) {
        console.log(`Impossible d'envoyer un DM à ${target.tag}`);
      }
      
    } catch (error) {
      console.error('Erreur lors du bannissement:', error);
      return interaction.reply({
        content: '❌ Une erreur est survenue lors du bannissement.',
        ephemeral: true
      });
    }
  },
};
