// === infractions.js ===
import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import fs from 'fs';
import { resolve } from 'path';

const warnPath = resolve(process.cwd(), 'data', 'warns.json');

export const data = new SlashCommandBuilder()
  .setName('infractions')
  .setDescription('Liste les avertissements d’un membre')
  // Restreint l'utilisation de la commande aux administrateurs
  .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
  .addUserOption(option =>
    option
      .setName('membre')
      .setDescription('Membre à inspecter')
      .setRequired(true)
  );

export async function execute(interaction) {
  // Vérification des permissions administrateur
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return interaction.reply({ content: '❌ Vous devez être administrateur pour utiliser cette commande.', ephemeral: true });
  }

  // Si le fichier n'existe pas, aucun avertissement n'est enregistré
  if (!fs.existsSync(warnPath)) {
    return interaction.reply({ content: '📋 Aucun avertissement enregistré.', ephemeral: false });
  }

  const warnsData = JSON.parse(fs.readFileSync(warnPath, 'utf8'));
  const user = interaction.options.getUser('membre');
  const userWarns = warnsData[user.id] || [];

  if (userWarns.length === 0) {
    return interaction.reply({ content: `${user.tag} n’a aucun avertissement.`, ephemeral: false });
  }

  const list = userWarns
    .map((w, i) => `${i + 1}. ${w.raison} (par ${w.par})`)
    .join('\n');

  await interaction.reply({ content: `📋 Infractions de ${user.tag} :\n${list}`, ephemeral: false });
}
