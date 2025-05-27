import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import { resolve } from 'path';

export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Avertit un membre')
  .addUserOption(option =>
    option
      .setName('membre')
      .setDescription('L’utilisateur à avertir')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('raison')
      .setDescription('Raison de l’avertissement')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction) {
  // Assure-toi que le dossier /data existe
  const dataDir = resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const warnPath = resolve(dataDir, 'warns.json');
  if (!fs.existsSync(warnPath)) fs.writeFileSync(warnPath, '{}', 'utf-8');

  const user = interaction.options.getUser('membre');
  const raison = interaction.options.getString('raison');

  // Lecture et mise à jour des avertissements
  let warnsData = {};
  try {
    warnsData = JSON.parse(fs.readFileSync(warnPath, 'utf-8'));
  } catch {
    warnsData = {};
  }

  if (!warnsData[user.id]) warnsData[user.id] = [];
  warnsData[user.id].push({
    par: interaction.user.tag,
    raison,
    date: new Date().toISOString()
  });

  fs.writeFileSync(warnPath, JSON.stringify(warnsData, null, 2), 'utf-8');

  // Réponse publique dans le chat
  await interaction.reply({ content: `⚠️ ${user.tag} a reçu un avertissement pour : ${raison}`, ephemeral: false });
}
