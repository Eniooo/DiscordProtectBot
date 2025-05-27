import fs from 'fs';
import { resolve } from 'path';
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('welcome')
  .setDescription('👋 Définit ou désactive le message de bienvenue.')
  .addSubcommand(sub =>
    sub
      .setName('set')
      .setDescription('Définit le message de bienvenue.')
      .addStringOption(opt =>
        opt
          .setName('message')
          .setDescription("Le texte d'au revoir (utilise {user} pour mentionner)")
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub
      .setName('off')
      .setDescription('Désactive le message de bienvenue.')
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const dataDir = resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const filePath = resolve(dataDir, 'welcome.json');

  let config = {};
  if (fs.existsSync(filePath)) {
    try {
      config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
      console.error('Erreur lecture welcome.json', err);
      return interaction.reply({ content: '❌ Impossible de lire la configuration de bienvenue.', ephemeral: false });
    }
  }

  const sub = interaction.options.getSubcommand();
  if (sub === 'off') {
    delete config[interaction.guild.id];
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
    return interaction.reply({ content: '✅ Message de bienvenue désactivé.', ephemeral: false });
  }

  // sub === 'set'
  const message = interaction.options.getString('message');
  config[interaction.guild.id] = message;
  try {
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
    return interaction.reply({ content: '✅ Message de bienvenue configuré !', ephemeral: false });
  } catch (err) {
    console.error('Erreur écriture welcome.json', err);
    return interaction.reply({ content: '❌ Impossible de sauvegarder la configuration.', ephemeral: false });
  }
}
