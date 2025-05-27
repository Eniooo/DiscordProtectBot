import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
  .setName('cat')
  .setDescription('Envoie une image de chat aléatoire.');

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: false });
  try {
    const res = await fetch('https://api.thecatapi.com/v1/images/search');
    if (!res.ok) throw new Error('Cat API non disponible');
    const [data] = await res.json();

    const embed = new EmbedBuilder()
      .setTitle('Voici un chat pour toi !')
      .setImage(data.url)
      .setFooter({ text: 'By Eniooo' })
      .setColor(Math.floor(Math.random() * 0xFFFFFF));

    await interaction.editReply({ embeds: [embed] });

    // Log dans le salon de logs
    const logChannel = interaction.guild?.channels.cache.get('1358548828004814939');
    if (logChannel) {
      logChannel.send(`🐱 ${interaction.user.tag} a utilisé la commande \`/cat\`. • By Eniooo`);
    }
  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: '❌ Impossible de récupérer une image de chat. By Eniooo' });
  }
}
