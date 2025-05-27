import 'dotenv/config';
import fs from 'fs';
import { Client, GatewayIntentBits, Collection, ActivityType } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';

// __dirname en ESM
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

client.commands = new Collection();

// Chargement des slash-commands
const commandsPath = resolve(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const filePath = resolve(commandsPath, file);
  const fileUrl = pathToFileURL(filePath).href;
  const { data, execute } = await import(fileUrl);
  client.commands.set(data.name, execute);
}

// Chargement des events
const eventsPath = resolve(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
    const filePath = resolve(eventsPath, file);
    const fileUrl = pathToFileURL(filePath).href;
    const eventModule = await import(fileUrl);
    const event = eventModule.default ?? eventModule;
    if (event.name && typeof event.execute === 'function') {
      client.on(event.name, (...args) => event.execute(...args));
    } else {
      console.warn(`Le module d'événement ${file} n'exporte pas correctement name et execute`);
    }
  }
}

// Log prêt et définition du statut
client.once('ready', () => {
  client.user.setPresence({
    status: 'idle',
    activities: [
      {
        name: '/help',
        type: ActivityType.Listening
      }
    ]
  });
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// Slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const handler = client.commands.get(interaction.commandName);
  if (!handler) return;
  try {
    await handler(interaction);
  } catch (error) {
    console.error('Erreur exécution commande :', error);
    const replyFn = interaction.replied || interaction.deferred
      ? interaction.followUp.bind(interaction)
      : interaction.reply.bind(interaction);
    await replyFn({ content: '❌ Une erreur est survenue.', ephemeral: true });
  }
});

client.login(process.env.TOKEN);
