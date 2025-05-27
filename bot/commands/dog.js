import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
  .setName('dog')
  .setDescription('Envoie une image de chien aléatoire.');

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: false });
  try {
    const res = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!res.ok) throw new Error('Dog API non disponible');
    const { message: imageUrl } = await res.json();

    const embed = new EmbedBuilder()
      .setTitle('Voici un chien pour toi ! 🐶')
      .setImage(imageUrl)
      .setFooter({ text: 'By Eniooo' })
      .setColor(Math.floor(Math.random() * 0xFFFFFF));

    await interaction.editReply({ embeds: [embed] });

    // Log dans le salon de logs
    const logChannel = interaction.guild?.channels.cache.get('1358548828004814939');
    if (logChannel) {
      logChannel.send(`🐶 ${interaction.user.tag} a utilisé la commande \`/dog\`. • By Eniooo`);
    }
  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: '❌ Impossible de récupérer une image de chien. By Eniooo' });
  }
}
