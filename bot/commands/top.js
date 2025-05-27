import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import { resolve } from 'path';

export const data = new SlashCommandBuilder()
  .setName('top')
  .setDescription('Affiche le Top 5 des XP');

export async function execute(interaction) {
  const xpPath = resolve(process.cwd(), 'data', 'xp.json');
  if (!fs.existsSync(xpPath)) {
    return interaction.reply({ content: '🏆 Aucun XP enregistré pour le moment.', ephemeral: false });
  }

  let xpData = {};
  try {
    xpData = JSON.parse(fs.readFileSync(xpPath, 'utf-8'));
  } catch (err) {
    console.error('Erreur lecture xp.json', err);
    return interaction.reply({ content: '❌ Erreur lors de la lecture des données XP.', ephemeral: false });
  }

  const sorted = Object.entries(xpData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (sorted.length === 0) {
    return interaction.reply({ content: '🏆 Pas assez de données pour générer un top.', ephemeral: false });
  }

  const text = sorted
    .map(([id, xp], i) => `${i + 1}. <@${id}> — ${xp} XP`)
    .join('\n');

  await interaction.reply({ content: `🏆 Top 5 XP :\n${text}`, ephemeral: false });
}
