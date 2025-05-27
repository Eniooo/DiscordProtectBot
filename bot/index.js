import 'dotenv/config';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// __dirname pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Collection pour stocker les commandes
client.commands = new Collection();

// 1️⃣ Chargement des slash-commands
const commandsPath = resolve(__dirname, 'bot', 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const filePath = resolve(commandsPath, file);
  const { data, execute } = await import(`file://${filePath}`);
  client.commands.set(data.name, execute);
}

// 2️⃣ Chargement des events (inclut guildMemberAdd pour l’autorole)
const eventsPath = resolve(__dirname, 'bot', 'events');
if (fs.existsSync(eventsPath)) {
  for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
    const filePath = resolve(eventsPath, file);
    const { name, execute } = await import(`file://${filePath}`);
    client.on(name, execute);
  }
}

// 3️⃣ Ready
client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// 4️⃣ InteractionCreate (slash commands)
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const handler = client.commands.get(interaction.commandName);
  if (!handler) return;
  try {
    await handler(interaction);
  } catch (err) {
    console.error('Erreur exécution commande :', err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ Une erreur est survenue.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Une erreur est survenue.', ephemeral: true });
    }
  }
});

// 5️⃣ Tes autres listeners (messageCreate, etc.) restent inchangés…

client.login(process.env.TOKEN);