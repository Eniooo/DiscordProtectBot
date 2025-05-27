import fs from 'fs';
import sqlite3 from 'sqlite3';
import { resolve } from 'path';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('levelup-message')
  .setDescription('🔄 Active ou désactive le message de montée de niveau pour toi.');

export async function execute(interaction) {
  const dataDir = resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const dbPath = resolve(dataDir, 'economy.sqlite');
  const sqlite = sqlite3.verbose();
  const db = new sqlite.Database(dbPath);

  db.serialize(() => {
    // Crée la table si nécessaire
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        userId TEXT PRIMARY KEY,
        balance INTEGER DEFAULT 0,
        lastDaily INTEGER DEFAULT 0,
        inventory TEXT DEFAULT '[]',
        levelUpMessage INTEGER DEFAULT 1
      )
    `);

    // Récupère la préférence actuelle
    db.get(
      'SELECT levelUpMessage FROM users WHERE userId = ?',
      [interaction.user.id],
      (err, row) => {
        if (err) {
          console.error(err);
          return interaction.reply({ content: '❌ Erreur base de données. By Eniooo', ephemeral: false });
        }

        const current = row ? row.levelUpMessage === 1 : true;
        const newVal = current ? 0 : 1;

        // Insère ou met à jour
        db.run(
          `
            INSERT INTO users(userId, levelUpMessage)
            VALUES(?, ?)
            ON CONFLICT(userId) DO UPDATE SET levelUpMessage = ?
          `,
          [interaction.user.id, newVal, newVal],
          (runErr) => {
            if (runErr) {
              console.error(runErr);
              return interaction.reply({ content: '❌ Impossible de mettre à jour ta préférence. By Eniooo', ephemeral: false });
            }

            const status = newVal === 1 ? 'activé' : 'désactivé';
            interaction.reply({
              content: `🔄 Le message de montée de niveau est désormais **${status}** pour toi. By Eniooo`,
              ephemeral: false
            });

            // Log dans le salon de logs
            const logChannel = interaction.guild?.channels.cache.get('1358548828004819939');
            if (logChannel) {
              logChannel.send(
                `🔄 ${interaction.user.tag} a ${status} le message de level-up. • By Eniooo`
              );
            }
          }
        );
      }
    );
  });
}
