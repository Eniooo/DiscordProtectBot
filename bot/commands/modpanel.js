import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('modpanel')
  .setDescription('Ouvre un panneau interactif pour la modération (admin seulement).')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  // Construction de l’embed
  const embed = new EmbedBuilder()
    .setTitle('🔧 Panel de Modération')
    .setDescription('Cliquez sur un bouton pour exécuter une action de modération :')
    .setColor(0x0044ff)
    .setFooter({ text: 'By Eniooo' });

  // Boutons de modération
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('mod-kick')
      .setLabel('Kick')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('mod-ban')
      .setLabel('Ban')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('mod-mute')
      .setLabel('Mute')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('mod-unmute')
      .setLabel('Unmute')
      .setStyle(ButtonStyle.Secondary)
  );

  // Envoi du panneau (réponse publique)
  await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
  const panelMessage = await interaction.fetchReply();

  // Collector pour gérer les clics
  const filter = i => i.user.id === interaction.user.id;
  const collector = panelMessage.createMessageComponentCollector({ filter, time: 600_000 });

  collector.on('collect', async i => {
    await i.deferReply({ ephemeral: true });

    // Ex: customId = "mod-kick"
    const [, action] = i.customId.split('-');

    // Demande de l'ID en DM
    const dmChannel = await i.user.createDM();
    await dmChannel.send(`Entrez l'ID de l'utilisateur à ${action} :`);

    const dmCollector = dmChannel.createMessageCollector({
      filter: m => m.author.id === interaction.user.id,
      max: 1,
      time: 60_000
    });

    dmCollector.on('collect', async dmMsg => {
      const userId = dmMsg.content.trim();
      const guildMember = await interaction.guild.members.fetch(userId).catch(() => null);
      if (!guildMember) {
        return i.editReply('❌ Membre introuvable.');
      }

      try {
        if (action === 'kick') {
          await guildMember.kick(`Kick via modpanel par ${interaction.user.tag}`);
          await i.editReply(`👢 ${guildMember.user.tag} a été kick. By Eniooo`);
        } else if (action === 'ban') {
          await guildMember.ban({ reason: `Ban via modpanel par ${interaction.user.tag}` });
          await i.editReply(`🔨 ${guildMember.user.tag} a été banni. By Eniooo`);
        } else if (action === 'mute') {
          const muteRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'mute');
          if (!muteRole) return i.editReply('❌ Rôle "mute" introuvable.');
          await guildMember.roles.add(muteRole, `Mute via modpanel par ${interaction.user.tag}`);
          await i.editReply(`🔇 ${guildMember.user.tag} a été mute. By Eniooo`);
        } else if (action === 'unmute') {
          const muteRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'mute');
          if (!muteRole) return i.editReply('❌ Rôle "mute" introuvable.');
          await guildMember.roles.remove(muteRole, `Unmute via modpanel par ${interaction.user.tag}`);
          await i.editReply(`✅ ${guildMember.user.tag} a été unmute. By Eniooo`);
        }

        // Log de l’action
        const logChannel = interaction.guild.channels.cache.get('1358548828004814939');
        if (logChannel) {
          logChannel.send(`🔧 Panel: ${interaction.user.tag} a exécuté "${i.customId}" sur ${guildMember.user.tag}. • By Eniooo`);
        }
      } catch (error) {
        console.error(error);
        i.editReply('❌ Erreur lors de l’opération.');
      }
    });
  });

  collector.on('end', () => {
    panelMessage.edit({ components: [] }).catch(() => {});
  });
}
