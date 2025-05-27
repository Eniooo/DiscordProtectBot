// events/messageCreate.js
import { Events, PermissionsBitField } from 'discord.js';
import fs from 'fs';
import { resolve } from 'path';

export default {
  name: Events.MessageCreate,
  async execute(message) {
    // Ignore bots et messages hors guildes
    if (!message.guild || message.author.bot) return;

    // Les administrateurs sont exemptés
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    // Charge la liste noire
    const filePath = resolve(process.cwd(), 'data', 'blacklist.json');
    if (!fs.existsSync(filePath)) return;

    let blacklist;
    try {
      blacklist = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
      console.error('Erreur lecture blacklist.json', err);
      return;
    }

    const content = message.content.toLowerCase();
    // Si un mot de la blacklist est trouvé dans le message, supprime-le
    for (const word of blacklist) {
      if (content.includes(word)) {
        try {
          await message.delete();
        } catch (deleteErr) {
          console.error('Impossible de supprimer le message :', deleteErr);
        }
        break;
      }
    }
  },
};
