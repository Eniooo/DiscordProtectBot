import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Expulse un membre du serveur')
  .addUserOption(option =>
    option
      .setName('membre')
      .setDescription('L’utilisateur à expulser')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('raison')
      .setDescription('Raison du kick')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

export async function execute(interaction) {
  const member = interaction.options.getMember('membre');
  const reason = interaction.options.getString('raison') || 'Pas de raison spécifiée.';
  
  if (!member || !member.kickable) {
    return interaction.reply({ content: '❌ Impossible d’expulser cet utilisateur.', ephemeral: true });
  }

  try {
    await member.kick(reason);
    return interaction.reply({ content: `👢 ${member.user.tag} expulsé. Raison : ${reason}`, ephemeral: false });
  } catch (error) {
    console.error('Erreur lors de l’expulsion :', error);
    return interaction.reply({ content: '❌ Une erreur est survenue lors de l’expulsion.', ephemeral: true });
  }
}
