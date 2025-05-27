import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
  .setName('quote')
  .setDescription('📜 Envoie une citation inspirante aléatoire.');

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: false });
  try {
    const res = await fetch('https://api.quotable.io/random');
    if (!res.ok) throw new Error('API citation non disponible');
    const { content, author } = await res.json();

    const embed = new EmbedBuilder()
      .setDescription(`_${content}_`)
      .setFooter({ text: `— ${author} • By Eniooo` })
      .setColor(0x0044ff);

    await interaction.editReply({ embeds: [embed] });

    // Log dans le salon de logs
    const logChannel = interaction.guild?.channels.cache.get('1358548828004814939');
    if (logChannel) {
      await logChannel.send(`📜 ${interaction.user.tag} a utilisé la commande \`/quote\`. • By Eniooo`);
    }
  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: '❌ Impossible de récupérer une citation pour le moment. By Eniooo' });
  }
}
