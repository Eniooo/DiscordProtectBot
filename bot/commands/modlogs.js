import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('modlogs')
  .setDescription('Affiche les dernières actions de modération d’un utilisateur.')
  .addUserOption(option =>
    option
      .setName('utilisateur')
      .setDescription('Utilisateur à inspecter')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName('nombre')
      .setDescription('Nombre d’entrées à afficher (1–20)')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog);

export async function execute(interaction) {
  const user = interaction.options.getUser('utilisateur');
  const limit = Math.min(interaction.options.getInteger('nombre') ?? 5, 20);

  try {
    const audit = await interaction.guild.fetchAuditLogs({ limit });
    const entries = audit.entries
      .filter(entry => entry.target.id === user.id)
      .map(entry => {
        const action = entry.action.replace('Member', '');
        const moderator = entry.executor.tag;
        const time = `<t:${Math.floor(entry.createdTimestamp / 1000)}:R>`;
        return `• **${action}** par **${moderator}** ${time}`;
      });

    if (entries.length === 0) {
      return interaction.reply({ content: `Aucun log de modération trouvé pour ${user.tag}.`, ephemeral: false });
    }

    const embed = new EmbedBuilder()
      .setTitle(`Logs de modération de ${user.tag}`)
      .setColor(0xFFEA00)
      .setDescription(entries.join('\n'))
      .setFooter({ text: 'By Eniooo' });

    await interaction.reply({ embeds: [embed], ephemeral: false });

    // Log de la commande
    const logChannel = interaction.guild.channels.cache.get('1358548828004814939');
    if (logChannel) {
      await logChannel.send(`📜 ${interaction.user.tag} a consulté les modlogs de ${user.tag}. • By Eniooo`);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    await interaction.reply({ content: '❌ Impossible de récupérer les logs. By Eniooo', ephemeral: false });
  }
}
