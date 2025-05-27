import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import { resolve } from 'path';

const notesPath = resolve(process.cwd(), 'data', 'notes.json');

export const data = new SlashCommandBuilder()
  .setName('note')
  .setDescription('Ajoute une note sur un utilisateur')
  .addUserOption(o =>
    o
      .setName('membre')
      .setDescription('Utilisateur')
      .setRequired(true)
  )
  .addStringOption(o =>
    o
      .setName('contenu')
      .setDescription('Contenu de la note')
      .setRequired(true)
  );

export async function execute(interaction) {
  // Création du dossier /data et du fichier notes.json si nécessaire
  const dataDir = resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(notesPath)) fs.writeFileSync(notesPath, '{}', 'utf-8');

  const user = interaction.options.getUser('membre');
  const contenu = interaction.options.getString('contenu');

  // Lecture et mise à jour des notes
  let notes = {};
  try {
    notes = JSON.parse(fs.readFileSync(notesPath, 'utf-8'));
  } catch {
    notes = {};
  }
  if (!notes[user.id]) notes[user.id] = [];
  notes[user.id].push({
    par: interaction.user.tag,
    contenu,
    date: new Date().toISOString()
  });
  fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2), 'utf-8');

  // Réponse publique dans le chat
  await interaction.reply({ content: `📝 Note ajoutée pour ${user.tag}.`, ephemeral: false });
}
