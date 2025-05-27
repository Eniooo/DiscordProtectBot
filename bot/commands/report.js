import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('report')
  .setDescription('📝 Permet de signaler un utilisateur avec une raison.')
  .addUserOption(option =>
    option
      .setName('utilisateur')
      .setDescription("L'utilisateur à signaler")
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('raison')
      .setDescription('Raison du signalement')
      .setRequired(true)
  );

export async function execute(interaction) {
  const target = interaction.options.getUser('utilisateur');
  const reason = interaction.options.getString('raison');

  // Remplace par l’ID de ton salon de logs
  const logChannel = interaction.guild.channels.cache.get('1358548828004814939');
  if (!logChannel) {
    return interaction.reply({ content: '❌ Salon de logs non trouvé. By Eniooo', ephemeral: false });
  }

  // Confirmation à l’auteur
  await interaction.reply({ content: `✅ Merci, votre signalement de ${target.tag} a bien été envoyé. By Eniooo`, ephemeral: false });

  // Envoi dans le salon de logs
  await logChannel.send(
    `📝 **Report** • ${interaction.user.tag} a signalé ${target.tag}\n> **Raison**: ${reason} • By Eniooo`
  );
}
