import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('mute')
  .setDescription('Réduit un membre au silence via le rôle Muted.')
  .addUserOption(option =>
    option
      .setName('membre')
      .setDescription('Membre à mute')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction) {
  const member = interaction.options.getMember('membre');
  if (!member) {
    return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
  }

  let muteRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
  try {
    // Création du rôle s'il n'existe pas
    if (!muteRole) {
      muteRole = await interaction.guild.roles.create({
        name: 'Muted',
        color: 'GREY',
        permissions: []
      });
      for (const [, channel] of interaction.guild.channels.cache) {
        await channel.permissionOverwrites.create(muteRole, {
          SendMessages: false,
          AddReactions: false,
          Speak: false
        });
      }
    }

    // Application du rôle
    await member.roles.add(muteRole);
    await interaction.reply({ content: `🔇 ${member.user.tag} a été réduit au silence.`, ephemeral: false });
  } catch (error) {
    console.error('Erreur lors du mute :', error);
    await interaction.reply({ content: '❌ Impossible de mute ce membre.', ephemeral: true });
  }
}
