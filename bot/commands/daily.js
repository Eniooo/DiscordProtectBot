import fs from 'fs';
import sqlite3 from 'sqlite3';
import { resolve } from 'path';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('🗓️ Réclame ta récompense journalière de monnaie virtuelle (100 coins).');

export async function execute(interaction) {
  // Assure-toi que le dossier /data existe
  const dataDir = resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const dbPath = resolve(dataDir, 'economy.sqlite');
  const sqlite = sqlite3.verbose();
  const db = new sqlite.Database(dbPath);

  // Permet de répondre plus tard
  await interaction.deferReply({ ephemeral: false });

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

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24h en ms

    db.get(
      'SELECT balance, lastDaily FROM users WHERE userId = ?',
      [interaction.user.id],
      async (err, row) => {
        if (err) {
          console.error(err);
          await interaction.editReply('❌ Erreur base de données. By Eniooo');
          db.close();
          return;
        }

        const last = row ? row.lastDaily : 0;
        if (now - last < cooldown) {
          const remaining = cooldown - (now - last);
          const hrs = Math.floor(remaining / 3600000);
          const mins = Math.floor((remaining % 3600000) / 60000);
          const secs = Math.floor((remaining % 60000) / 1000);
          await interaction.editReply(
            `🕒 Tu as déjà réclamé ta récompense quotidienne. Réessaie dans ${hrs}h ${mins}m ${secs}s. By Eniooo`
          );
          db.close();
          return;
        }

        const reward = 100;
        const newBalance = (row ? row.balance : 0) + reward;

        db.run(
          `
            INSERT INTO users(userId, balance, lastDaily)
            VALUES(?, ?, ?)
            ON CONFLICT(userId) DO UPDATE SET
              balance = ?,
              lastDaily = ?
          `,
          [interaction.user.id, newBalance, now, newBalance, now],
          async runErr => {
            if (runErr) {
              console.error(runErr);
              await interaction.editReply('❌ Impossible de mettre à jour ton solde. By Eniooo');
            } else {
              await interaction.editReply(
                `✅ Tu as reçu **${reward} coins** ! Solde actuel : **${newBalance}**. By Eniooo`
              );
              // Log dans le salon de logs
              const logChannel = interaction.guild.channels.cache.get('1358548828004814939');
              if (logChannel) {
                logChannel.send(
                  `🗓️ ${interaction.user.tag} a réclamé sa récompense quotidienne (100 coins). Solde : ${newBalance}. • By Eniooo`
                );
              }
            }
            db.close();
          }
        );
      }
    );
  });
}
