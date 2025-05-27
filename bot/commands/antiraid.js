import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import { resolve } from 'path';

export const data = new SlashCommandBuilder()
  .setName('antiraid')
  .setDescription('🛡️ Active ou désactive les protections anti-raid.')
  .addStringOption(option =>
    option
      .setName('etat')
      .setDescription('on ou off')
      .setRequired(true)
      .addChoices(
        { name: 'on', value: 'on' },
        { name: 'off', value: 'off' }
      )
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const state = interaction.options.getString('etat');
  const dataDir = resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const filePath = resolve(dataDir, 'antiraid.json');
  let config = {};
  
  if (fs.existsSync(filePath)) {
    try {
      config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
      console.error('Erreur lecture antiraid.json', err);
      return interaction.reply({ content: '❌ Impossible de lire la config anti-raid.', ephemeral: false });
    }
  }

  config[interaction.guild.id] = state === 'on';
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
    await interaction.reply({
      content: `🛡️ Protections anti-raid **${state === 'on' ? 'activées' : 'désactivées'}** ! By Eniooo`,
      ephemeral: false
    });

    const logChannel = interaction.guild.channels.cache.get('1358548828004814939');
    if (logChannel) {
      await logChannel.send(
        `🛡️ ${interaction.user.tag} a ${state === 'on' ? 'activé' : 'désactivé'} l'antiraid sur ce serveur. • By Eniooo`
      );
    }
  } catch (err) {
    console.error('Erreur écriture antiraid.json', err);
    return interaction.reply({ content: '❌ Impossible de mettre à jour la config anti-raid.', ephemeral: false });
  }
}
