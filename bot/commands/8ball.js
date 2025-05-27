import { SlashCommandBuilder } from 'discord.js';

const responses = [
  'Oui',
  'Non',
  'Peut-être',
  'Repose ta question',
  'Jamais',
  'Certainement'
];

export const data = new SlashCommandBuilder()
  .setName('8ball')
  .setDescription('Pose une question')
  .addStringOption(option =>
    option
      .setName('question')
      .setDescription('Ta question')
      .setRequired(true)
  );

export async function execute(interaction) {
  const question = interaction.options.getString('question');
  const response = responses[Math.floor(Math.random() * responses.length)];
  
  // Réponse publique (non-éphémère)
  await interaction.reply({
    content: `🎱 Tu as demandé : "${question}"\nRéponse : ${response}`,
    ephemeral: false
  });
}
