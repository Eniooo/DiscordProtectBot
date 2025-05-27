import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('lock')
  .setDescription("🔐 Verrouille le salon actuel (désactive l'envoi de messages pour @everyone).")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction) {
  const everyone = interaction.guild.roles.everyone;
  const channel = interaction.channel;
  
  try {
    await channel.permissionOverwrites.edit(everyone, { SEND_MESSAGES: false });
    await interaction.reply({ content: '🔒 Salon verrouillé ! By Eniooo', ephemeral: false });

    const logChannel = interaction.guild.channels.cache.get('1358548828004814939');
    if (logChannel) {
      await logChannel.send(`🔒 ${interaction.user.tag} a verrouillé ${channel} • By Eniooo`);
    }
  } catch (error) {
    console.error('Erreur verrouillage :', error);
    await interaction.reply({ content: '❌ Impossible de verrouiller ce salon. By Eniooo', ephemeral: false });
  }
}
