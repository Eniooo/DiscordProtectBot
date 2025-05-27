import 'dotenv/config';
import fs from 'fs';
import { REST, Routes } from 'discord.js';
import { resolve } from 'path';

const commandsDir = resolve(process.cwd(), 'bot', 'commands');
const commandFiles = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));

const commands = [];
for (const file of commandFiles) {
  const filePath = resolve(commandsDir, file);
  // import dynamique pour récupérer data
  const { data } = await import(`file://${filePath}`);
  commands.push(data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`🔄 Déploiement de ${commands.length} commandes…`);
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands déployées avec succès.');
  } catch (error) {
    console.error('❌ Erreur de déploiement :', error);
  }
})();