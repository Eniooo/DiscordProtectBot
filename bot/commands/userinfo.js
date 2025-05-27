import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Affiche les informations d’un utilisateur.')
  .addUserOption(option =>
    option
      .setName('utilisateur')
      .setDescription('L’utilisateur à inspecter')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const user = interaction.options.getUser('utilisateur') || interaction.user;
  const member = await interaction.guild.members.fetch(user.id);

  const createdTs = Math.floor(user.createdTimestamp / 1000);
  const joinedTs = Math.floor(member.joinedTimestamp / 1000);

  const embed = new EmbedBuilder()
    .setTitle(`ℹ️ Infos pour ${user.tag}`)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: '🆔 ID', value: user.id, inline: true },
      { name: '📅 Compte créé le', value: `<t:${createdTs}:D>`, inline: true },
      { name: '📥 A rejoint le serveur', value: `<t:${joinedTs}:D>`, inline: true },
      { name: '🏷️ Rôles', value: member.roles.cache.map(r => r.name).join(', ') || 'Aucun', inline: false }
    )
    .setFooter({ text: 'By Eniooo' })
    .setColor(0x5865F2);

  await interaction.reply({ embeds: [embed], ephemeral: false });

  // Log dans le salon de logs
  const logChannel = interaction.guild.channels.cache.get('1358548828004819939');
  if (logChannel) {
    logChannel.send(`ℹ️ ${interaction.user.tag} a utilisé la commande \`/userinfo\` sur ${user.tag}. • By Eniooo`);
  }
}
