import fs from 'fs';
import { SlashCommandBuilder } from 'discord.js';
import sqlite3 from 'sqlite3';
import { resolve } from 'path';

export const data = new SlashCommandBuilder()
  .setName('inventory')
  .setDescription('🎒 Affiche ton inventaire virtuel.');

export async function execute(interaction) {
  // Assure-toi que le dossier /data existe
  const dataDir = resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const dbPath = resolve(dataDir, 'economy.sqlite');
  const sqlite = sqlite3.verbose();
  const db = new sqlite.Database(dbPath);

  db.serialize(() => {
    // Création de la table si elle n’existe pas
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        userId TEXT PRIMARY KEY,
        balance INTEGER DEFAULT 0,
        lastDaily INTEGER DEFAULT 0,
        inventory TEXT DEFAULT '[]',
        levelUpMessage INTEGER DEFAULT 1
      )
    `);

    db.get(
      'SELECT inventory FROM users WHERE userId = ?',
      [interaction.user.id],
      async (err, row) => {
        db.close();
        if (err) {
          console.error(err);
          return interaction.reply({ content: '❌ Erreur base de données. By Eniooo', ephemeral: false });
        }

        const items = row ? JSON.parse(row.inventory) : [];
        if (!items.length) {
          return interaction.reply({ content: '🎒 Ton inventaire est vide. By Eniooo', ephemeral: false });
        }

        const list = items.map((it, i) => `${i + 1}. ${it}`).join('\n');
        await interaction.reply({
          content: `🎒 **Ton inventaire :**\n${list}\nBy Eniooo`,
          ephemeral: false
        });

        // Log dans le salon de logs
        const logChannel = interaction.guild?.channels.cache.get('1358548828004819939');
        if (logChannel) {
          logChannel.send(`🎒 ${interaction.user.tag} a consulté son inventaire. • By Eniooo`);
        }
      }
    );
  });
}
