import fs from 'fs';
import sqlite3 from 'sqlite3';
import { resolve } from 'path';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('💰 Affiche ton solde de monnaie virtuelle.');

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
      'SELECT balance FROM users WHERE userId = ?',
      [interaction.user.id],
      async (err, row) => {
        if (err) {
          console.error(err);
          await interaction.reply({ content: '❌ Erreur base de données. By Eniooo', ephemeral: false });
          db.close();
          return;
        }

        const bal = row ? row.balance : 0;
        await interaction.reply({
          content: `💰 Ton solde est de **${bal} coins**. By Eniooo`,
          ephemeral: false
        });

        // Log dans le salon de logs
        const logChannel = interaction.guild?.channels.cache.get('1358548828004819939');
        if (logChannel) {
          logChannel.send(`💰 ${interaction.user.tag} a consulté son solde (${bal} coins). • By Eniooo`);
        }
        db.close();
      }
    );
  });
}
