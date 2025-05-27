import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('pileface')
  .setDescription('Lance une pièce : pile ou face ?');

export async function execute(interaction) {
  const result = Math.random() < 0.5 ? '🪙 Pile !' : '🪙 Face !';
  await interaction.reply({ content: result, ephemeral: false });
}
