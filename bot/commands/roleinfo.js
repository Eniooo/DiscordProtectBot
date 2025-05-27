import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('roleinfo')
  .setDescription('🏷️ Affiche les informations d’un rôle.')
  .addRoleOption(option =>
    option
      .setName('role')
      .setDescription('Le rôle à inspecter')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const role = interaction.options.getRole('role');

  const embed = new EmbedBuilder()
    .setTitle(`ℹ️ Infos pour le rôle **${role.name}**`)
    .addFields(
      { name: '🆔 ID', value: role.id, inline: true },
      { name: '🎨 Couleur', value: role.hexColor, inline: true },
      { name: '👤 Membres', value: `${role.members.size}`, inline: true },
      { name: '🔖 Mentionnable', value: role.mentionable ? 'Oui' : 'Non', inline: true },
      { name: '📈 Position', value: `${role.position}`, inline: true }
    )
    .setFooter({ text: 'By Eniooo' })
    .setColor(role.color || 0x5865F2);

  await interaction.reply({ embeds: [embed], ephemeral: false });

  // Log dans le salon de logs si défini
  const logChannel = interaction.guild.channels.cache.get('1358548828004819939');
  if (logChannel) {
    logChannel.send(`🏷️ ${interaction.user.tag} a utilisé la commande \`/roleinfo\` sur ${role.name}. • By Eniooo`);
  }
}
