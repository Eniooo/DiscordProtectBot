import 'dotenv/config';
import fs from 'fs';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
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
    const { name, execute } = await import(fileUrl);
    client.on(name, execute);
  }
}

// Log prêt
client.once('ready', () => {
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

// ❌ TEMPORAIREMENT désactivé : socket.io
// Assure-toi que dashboard/index.js contient bien : export { io }
// import { io } from '../dashboard/index.js';
// client.on('guildMemberAdd', member => {
//   io.emit('log', { timestamp: new Date().toLocaleTimeString(), message: `${member.user.tag} a rejoint.` });
// });
// client.on('warn', (user, reason) => {
//   io.emit('warn', { timestamp: new Date().toLocaleTimeString(), user: user.tag, reason });
// });
// client.on('ban', (user, reason) => {
//   io.emit('ban', { timestamp: new Date().toLocaleTimeString(), user: user.tag, reason });
// });

client.login(process.env.TOKEN);
