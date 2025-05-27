import fs from 'fs';
import { resolve } from 'path';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('autorole')
  .setDescription('Gère le rôle attribué automatiquement aux nouveaux membres.')
  .addSubcommand(sub =>
    sub
      .setName('set')
      .setDescription('Définit le rôle à attribuer aux nouveaux membres.')
      .addRoleOption(opt =>
        opt
          .setName('role')
          .setDescription('Le rôle à attribuer')
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub
      .setName('off')
      .setDescription('Désactive l’autorole.')
  );

export async function execute(interaction) {
  // Assure-toi que le dossier /data existe
  const dataDir = resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const filePath = resolve(dataDir, 'autorole.json');
  let config = {};

  // Lecture de la config existante
  if (fs.existsSync(filePath)) {
    try {
      config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
      console.error('❌ Impossible de lire autorole.json', err);
      return interaction.reply({ content: '❌ Erreur de lecture de la config autorole.', ephemeral: true });
    }
  }

  const sub = interaction.options.getSubcommand();
  if (sub === 'off') {
    delete config[interaction.guild.id];
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
    return interaction.reply({ content: '✅ Autorole désactivé.', ephemeral: true });
  }

  // sub === 'set'
  const role = interaction.options.getRole('role');
  config[interaction.guild.id] = role.id;
  try {
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
    return interaction.reply({ content: `✅ Autorole configuré : ${role} sera attribué aux nouveaux membres.`, ephemeral: true });
  } catch (err) {
    console.error('❌ Impossible d’écrire autorole.json', err);
    return interaction.reply({ content: '❌ Erreur de sauvegarde de la config autorole.', ephemeral: true });
  }
}
