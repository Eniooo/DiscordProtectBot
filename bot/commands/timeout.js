import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('timeout')
  .setDescription('Met un membre en timeout pendant X minutes.')
  .addUserOption(option =>
    option
      .setName('membre')
      .setDescription('Membre à mettre en timeout')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName('minutes')
      .setDescription('Durée en minutes')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction) {
  const member = interaction.options.getMember('membre');
  const minutes = interaction.options.getInteger('minutes');

  if (!member || !member.moderatable) {
    return interaction.reply({ content: "❌ Je ne peux pas mettre ce membre en timeout.", ephemeral: false });
  }

  try {
    await member.timeout(minutes * 60_000, 'Timeout via commande');
    await interaction.reply({ content: `⏳ ${member.user.tag} est en timeout pour ${minutes} minute(s).`, ephemeral: false });
  } catch (error) {
    console.error('Erreur lors du timeout :', error);
    await interaction.reply({ content: '❌ Une erreur est survenue lors du timeout.', ephemeral: false });
  }
}
