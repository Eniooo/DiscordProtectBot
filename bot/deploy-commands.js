import 'dotenv/config';
import fs from 'fs';
import { REST, Routes } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';

// __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// On pointe directement vers le dossier `commands` au même niveau
const commandsDir = resolve(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

const commands = [];
for (const file of commandFiles) {
  const filePath = resolve(commandsDir, file);
  const fileUrl = pathToFileURL(filePath).href;
  const { data } = await import(fileUrl);
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
