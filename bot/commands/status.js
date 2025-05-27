import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('📊 Affiche le statut actuel du bot (uptime, latence, serveurs).')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const client = interaction.client;
  const uptimeMs = client.uptime;
  const seconds = Math.floor((uptimeMs / 1000) % 60);
  const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
  const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));

  const embed = new EmbedBuilder()
    .setTitle('🤖 Statut du Bot')
    .addFields(
      { name: '⏱ Uptime', value: `${days}j ${hours}h ${minutes}m ${seconds}s`, inline: true },
      { name: '🌐 Serveurs', value: `${client.guilds.cache.size}`, inline: true },
      { name: '📡 Latence', value: `${client.ws.ping}ms`, inline: true }
    )
    .setFooter({ text: 'By Eniooo' })
    .setColor(0x4dff52);

  await interaction.reply({ embeds: [embed], ephemeral: false });

  // Log de l’utilisation dans le salon de logs (remplace l’ID si besoin)
  const logChannel = interaction.guild?.channels.cache.get('1358548828004819939');
  if (logChannel) {
    logChannel.send(`📊 ${interaction.user.tag} a utilisé la commande \`/status\`. • By Eniooo`);
  }
}
