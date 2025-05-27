import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import { resolve } from 'path';

const warnPath = resolve(process.cwd(), 'data', 'warns.json');

export const data = new SlashCommandBuilder()
  .setName('infractions')
  .setDescription('Liste les avertissements d’un membre')
  .addUserOption(option =>
    option
      .setName('membre')
      .setDescription('Membre à inspecter')
      .setRequired(true)
  );

export async function execute(interaction) {
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
