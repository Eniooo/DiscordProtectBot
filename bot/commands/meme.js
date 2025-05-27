import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
  .setName('meme')
  .setDescription('Envoie un mème aléatoire depuis Reddit.');

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: false });
  try {
    const res = await fetch('https://meme-api.herokuapp.com/gimme');
    if (!res.ok) throw new Error('Meme API non disponible');
    const { title, url, postLink, subreddit, author } = await res.json();

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setURL(postLink)
      .setImage(url)
      .setFooter({ text: `r/${subreddit} • ${author} • By Eniooo` })
      .setColor(Math.floor(Math.random() * 0xFFFFFF));

    await interaction.editReply({ embeds: [embed] });

    // Log dans le salon de logs
    const logChannel = interaction.guild?.channels.cache.get('1358548828004814939');
    if (logChannel) {
      logChannel.send(`📨 ${interaction.user.tag} a utilisé la commande \`/meme\`. • By Eniooo`);
    }
  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: '❌ Impossible de récupérer un mème pour le moment. By Eniooo' });
  }
}
