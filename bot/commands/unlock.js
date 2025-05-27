import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('unlock')
  .setDescription("🔓 Déverrouille le salon actuel (réactive l'envoi de messages pour @everyone).")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction) {
  const everyone = interaction.guild.roles.everyone;
  const channel = interaction.channel;

  try {
    await channel.permissionOverwrites.edit(everyone, { SEND_MESSAGES: true });
    await interaction.reply({ content: '🔓 Salon déverrouillé ! By Eniooo', ephemeral: false });

    const logChannel = interaction.guild.channels.cache.get('1358548828004814939');
    if (logChannel) {
      await logChannel.send(`🔓 ${interaction.user.tag} a déverrouillé ${channel} • By Eniooo`);
    }
  } catch (error) {
    console.error('Erreur déverrouillage :', error);
    await interaction.reply({ content: '❌ Impossible de déverrouiller ce salon. By Eniooo', ephemeral: false });
  }
}
