import weather from 'weather-js';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('weather')
  .setDescription('🌤️ Donne la météo pour une ville donnée (Celsius).')
  .addStringOption(option =>
    option
      .setName('ville')
      .setDescription('Nom de la ville')
      .setRequired(true)
  );

export async function execute(interaction) {
  const ville = interaction.options.getString('ville');
  await interaction.deferReply({ ephemeral: false });

  try {
    const result = await new Promise((resolve, reject) => {
      weather.find({ search: ville, degreeType: 'C' }, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

    if (!result || result.length === 0) {
      return interaction.editReply('❌ Je n’ai pas trouvé la météo pour cette ville. By Eniooo');
    }

    const current = result[0].current;
    const locationInfo = result[0].location;

    const embed = new EmbedBuilder()
      .setTitle(`Météo à ${locationInfo.name}`)
      .setDescription(current.skytext)
      .addFields(
        { name: '🌡️ Température', value: `${current.temperature}°C`, inline: true },
        { name: 'Ressenti', value: `${current.feelslike}°C`, inline: true },
        { name: '💧 Humidité', value: `${current.humidity}%`, inline: true },
        { name: '💨 Vent', value: `${current.winddisplay}`, inline: true }
      )
      .setThumbnail(current.imageUrl)
      .setFooter({ text: 'By Eniooo' });

    await interaction.editReply({ embeds: [embed] });

    const logChannel = interaction.guild?.channels.cache.get('1358548828004814939');
    if (logChannel) {
      logChannel.send(`🌤️ ${interaction.user.tag} a demandé la météo pour ${locationInfo.name}. • By Eniooo`);
    }
  } catch (error) {
    console.error(error);
    await interaction.editReply('❌ Une erreur est survenue lors de la récupération de la météo. By Eniooo');
  }
}
