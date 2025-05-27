import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import { resolve } from 'path';

const notesPath = resolve(process.cwd(), 'data', 'notes.json');

export const data = new SlashCommandBuilder()
  .setName('info')
  .setDescription("Affiche les infos d'un utilisateur")
  .addUserOption(option =>
    option
      .setName('utilisateur')
      .setDescription('Utilisateur à inspecter')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction) {
  const user = interaction.options.getUser('utilisateur') || interaction.user;
  const member = await interaction.guild.members.fetch(user.id);

  const embed = {
    title: `Informations sur ${user.tag}`,
    thumbnail: { url: user.displayAvatarURL() },
    fields: [
      { name: '🆔 ID', value: user.id, inline: true },
      { name: '📅 Créé le', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
      { name: '📥 A rejoint le serveur', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true }
    ],
    color: 0x5865F2
  };

  // Ajout des notes internes si le modérateur le demande
  const isModo = interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers);
  if (isModo && fs.existsSync(notesPath)) {
    const notesData = JSON.parse(fs.readFileSync(notesPath, 'utf-8'));
    const notesUser = notesData[user.id] || [];
    if (notesUser.length) {
      embed.fields.push({
        name: '📝 Notes internes',
        value: notesUser.map(n => `• ${n.contenu} _(par ${n.par})_`).join('\n')
      });
    }
  }

  await interaction.reply({ embeds: [embed], ephemeral: false });
}
