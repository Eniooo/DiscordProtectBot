import { SlashCommandBuilder } from 'discord.js';

const blagues = [
  "Pourquoi les canards ont-ils autant de plumes ? Pour couvrir leur derrière.",
  "Un photon entre dans un hôtel. Le réceptionniste lui demande s’il a des bagages. Il répond : Non, je voyage léger.",
  "Pourquoi les plongeurs plongent-ils toujours en arrière et jamais en avant ? Parce que sinon ils tombent dans le bateau."
];

export const data = new SlashCommandBuilder()
  .setName('blague')
  .setDescription('Envoie une blague au hasard.');

export async function execute(interaction) {
  const random = blagues[Math.floor(Math.random() * blagues.length)];
  await interaction.reply({ content: random, ephemeral: false });
}
