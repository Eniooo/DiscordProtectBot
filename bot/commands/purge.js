import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('purge')
  .setDescription('🧹 Supprime les messages récents d’un utilisateur dans ce salon.')
  .addUserOption(option =>
    option
      .setName('membre')
      .setDescription('Le membre dont supprimer les messages')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction) {
  const user = interaction.options.getUser('membre');
  const channel = interaction.channel;

  try {
    // Récupère les 100 derniers messages
    const fetched = await channel.messages.fetch({ limit: 100 });
    // Ne garde que ceux de l’utilisateur ciblé
    const userMessages = fetched.filter(msg => msg.author.id === user.id);

    if (userMessages.size === 0) {
      return interaction.reply({
        content: `🚫 Aucun message de ${user.tag} à supprimer.`,
        ephemeral: false
      });
    }

    await channel.bulkDelete(userMessages, true);
    await interaction.reply({
      content: `✅ Purge de ${userMessages.size} message(s) de ${user.tag}.`,
      ephemeral: false
    });

    // Log dans le salon de logs si défini
    const logChannel = interaction.guild.channels.cache.get('1358548828004814939');
    if (logChannel) {
      logChannel.send(
        `🧹 ${interaction.user.tag} a purgé ${userMessages.size} message(s) de ${user.tag} dans ${channel}. • By Eniooo`
      );
    }
  } catch (error) {
    console.error('Erreur purge :', error);
    return interaction.reply({
      content: '❌ Impossible d’effectuer la purge.',
      ephemeral: false
    });
  }
}
