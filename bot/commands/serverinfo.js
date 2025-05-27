import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('serverinfo')
  .setDescription('📊 Affiche les informations du serveur.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false);

export async function execute(interaction) {
  const guild = interaction.guild;
  const createdTs = Math.floor(guild.createdTimestamp / 1000);

  const embed = new EmbedBuilder()
    .setTitle(`Informations sur **${guild.name}**`)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .addFields(
      { name: '🆔 ID', value: guild.id, inline: true },
      { name: '👑 Propriétaire', value: `<@${guild.ownerId}>`, inline: true },
      { name: '🌐 Langue', value: guild.preferredLocale, inline: true },
      { name: '👥 Membres', value: `${guild.memberCount}`, inline: true },
      { name: '💬 Salons', value: `${guild.channels.cache.size}`, inline: true },
      { name: '🏷️ Rôles', value: `${guild.roles.cache.size}`, inline: true },
      { name: '📅 Créé le', value: `<t:${createdTs}:D>`, inline: true }
    )
    .setFooter({ text: 'By Eniooo' })
    .setColor(0x5865F2);

  await interaction.reply({ embeds: [embed], ephemeral: false });

  // Log de l'utilisation
  const logChan = guild.channels.cache.get('1358548828004819939');
  if (logChan) {
    logChan.send(
      `📊 ${interaction.user.tag} a utilisé la commande \`/serverinfo\`. • By Eniooo`
    );
  }
}
