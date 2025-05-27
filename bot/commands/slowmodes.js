import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('slowmode')
  .setDescription('⏱ Configure le slowmode du salon actuel en secondes.')
  .addIntegerOption(option =>
    option
      .setName('secondes')
      .setDescription('Durée du slowmode (0–21600 secondes)')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction) {
  const seconds = interaction.options.getInteger('secondes');
  const channel = interaction.channel;

  if (seconds < 0 || seconds > 21600) {
    return interaction.reply({
      content: '🚫 Le slowmode doit être entre 0 et 21600 secondes.',
      ephemeral: false
    });
  }

  try {
    await channel.setRateLimitPerUser(seconds, `Slowmode réglé par ${interaction.user.tag}`);
    await interaction.reply({
      content: `⏱ Slowmode réglé à **${seconds}** seconde(s) !`,
      ephemeral: false
    });

    const logChannel = interaction.guild.channels.cache.get('1358548828004814939');
    if (logChannel) {
      logChannel.send(
        `⏱ ${interaction.user.tag} a réglé le slowmode de ${channel} à ${seconds}s • By Eniooo`
      );
    }
  } catch (error) {
    console.error('Erreur slowmode :', error);
    return interaction.reply({
      content: '❌ Impossible de modifier le slowmode.',
      ephemeral: false
    });
  }
}
