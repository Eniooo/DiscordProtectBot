import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import { resolve } from 'path';

export const data = new SlashCommandBuilder()
  .setName('unblacklist')
  .setDescription('✅ Retire un mot de la liste noire.')
  .addStringOption(option =>
    option
      .setName('mot')
      .setDescription('Le mot à retirer')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const word = interaction.options.getString('mot');
  const dataDir = resolve(process.cwd(), 'data');
  const filePath = resolve(dataDir, 'blacklist.json');

  if (!fs.existsSync(filePath)) {
    return interaction.reply({ content: '❌ Aucun fichier de blacklist trouvé.', ephemeral: false });
  }

  let list;
  try {
    list = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error('Erreur lecture blacklist.json', err);
    return interaction.reply({ content: '❌ Impossible de lire la liste noire.', ephemeral: false });
  }

  const lower = word.toLowerCase();
  if (!list.includes(lower)) {
    return interaction.reply({ content: `❌ Le mot \`${word}\` n'est pas dans la blacklist.`, ephemeral: false });
  }

  const updated = list.filter(w => w !== lower);
  try {
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
    await interaction.reply({ content: `✅ Le mot \`${word}\` a été retiré de la blacklist.`, ephemeral: false });

    // Met à jour la liste en mémoire si vous y stockez
    interaction.client.blacklist = updated;
    
    const logChannel = interaction.guild.channels.cache.get('1358548828004814939');
    if (logChannel) {
      logChannel.send(`✅ ${interaction.user.tag} a retiré le mot "${word}" de la blacklist. • By Eniooo`);
    }
  } catch (err) {
    console.error('Erreur écriture blacklist.json', err);
    return interaction.reply({ content: '❌ Impossible de mettre à jour la liste noire.', ephemeral: false });
  }
}
