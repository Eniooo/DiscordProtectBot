import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Bannit un membre du serveur')
  .addUserOption(option =>
    option
      .setName('membre')
      .setDescription('L’utilisateur à bannir')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('raison')
      .setDescription('Raison du bannissement')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export async function execute(interaction) {
  const member = interaction.options.getMember('membre');
  const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée.';

  if (!member || !member.bannable) {
    return interaction.reply({ content: '❌ Impossible de bannir cet utilisateur.', ephemeral: true });
  }

  try {
    await member.ban({ reason });
    return interaction.reply({ content: `🔨 ${member.user.tag} a été banni. Raison : ${reason}`, ephemeral: false });
  } catch (error) {
    console.error('Erreur lors du bannissement :', error);
    return interaction.reply({ content: '❌ Une erreur est survenue lors du bannissement.', ephemeral: true });
  }
}
