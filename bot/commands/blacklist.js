import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import { resolve } from 'path';

export const data = new SlashCommandBuilder()
  .setName('blacklist')
  .setDescription('Ajoute un mot à la liste noire. Les messages contenant ce mot seront supprimés.')
  .addStringOption(option =>
    option
      .setName('mot')
      .setDescription('Le mot à blacklist')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const word = interaction.options.getString('mot').toLowerCase();

  // Assure-toi que le dossier /data existe
  const dataDir = resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const filePath = resolve(dataDir, 'blacklist.json');
  let list = [];

  // Lecture de la blacklist existante
  if (fs.existsSync(filePath)) {
    try {
      list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
      console.error('Erreur lecture blacklist.json', err);
    }
  }

  if (list.includes(word)) {
    return interaction.reply({
      content: `❌ Le mot \`${word}\` est déjà blacklisté.`,
      ephemeral: false
    });
  }

  list.push(word);
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');

  await interaction.reply({
    content: `✅ Le mot \`${word}\` a été ajouté à la blacklist.`,
    ephemeral: false
  });

  // Si tu caches la liste en mémoire, tu peux faire :
  // interaction.client.blacklist = list;
}
