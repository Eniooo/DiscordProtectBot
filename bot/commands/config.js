import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import { resolve } from 'path';

export const data = new SlashCommandBuilder()
  .setName('config')
  .setDescription('Active ou désactive un module')
  .addStringOption(option =>
    option
      .setName('module')
      .setDescription('Nom du module (e.g. antiSpam, antiLien)')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('etat')
      .setDescription('on ou off')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const moduleName = interaction.options.getString('module');
  const etat = interaction.options.getString('etat').toLowerCase();
  const configPath = resolve(process.cwd(), 'config.json');

  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.error('Erreur lecture config.json', err);
    return interaction.reply({ content: '❌ Impossible de lire la configuration.', ephemeral: true });
  }

  if (!(moduleName in config)) {
    return interaction.reply({ content: '❌ Module inconnu.', ephemeral: true });
  }

  config[moduleName] = etat === 'on';
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return interaction.reply({ 
      content: `🔧 Module **${moduleName}** mis à jour : ${etat === 'on' ? '✅ Activé' : '❌ Désactivé'}`, 
      ephemeral: false 
    });
  } catch (err) {
    console.error('Erreur écriture config.json', err);
    return interaction.reply({ content: '❌ Impossible de sauvegarder la configuration.', ephemeral: true });
  }
}