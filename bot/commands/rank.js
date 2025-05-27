import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import { resolve } from 'path';

export const data = new SlashCommandBuilder()
  .setName('rank')
  .setDescription('Voir ton XP');

export async function execute(interaction) {
  const xpPath = resolve(process.cwd(), 'data', 'xp.json');
  let xpData = {};
  if (fs.existsSync(xpPath)) {
    try {
      xpData = JSON.parse(fs.readFileSync(xpPath, 'utf-8'));
    } catch (err) {
      console.error('❌ Erreur lecture xp.json', err);
    }
  }

  const xp = xpData[interaction.user.id] || 0;
  const level = Math.floor(0.1 * Math.sqrt(xp));

  await interaction.reply({
    content: `📊 Tu as ${xp} XP (niveau ${level})`,
    ephemeral: false
  });
}
