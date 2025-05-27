import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Supprime des messages')
  .addIntegerOption(option =>
    option
      .setName('nombre')
      .setDescription('Combien ? (1–100)')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction) {
  const count = interaction.options.getInteger('nombre');
  if (count < 1 || count > 100) {
    return interaction.reply({ content: '🚫 Le nombre doit être entre 1 et 100.', ephemeral: false });
  }

  try {
    const deleted = await interaction.channel.bulkDelete(count, true);
    return interaction.reply({ content: `🧹 ${deleted.size} messages supprimés.`, ephemeral: false });
  } catch (error) {
    console.error('Erreur lors de la suppression des messages :', error);
    return interaction.reply({ content: '❌ Impossible de supprimer les messages.', ephemeral: false });
  }
}
