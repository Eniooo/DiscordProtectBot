import fs from 'fs';
import sqlite3 from 'sqlite3';
import { resolve } from 'path';
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('pay')
  .setDescription('💸 Transfère de la monnaie virtuelle à un autre utilisateur.')
  .addUserOption(option =>
    option
      .setName('utilisateur')
      .setDescription('Le membre à payer')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName('montant')
      .setDescription('Le nombre de coins à transférer')
      .setRequired(true)
  );

export async function execute(interaction) {
  const target = interaction.options.getUser('utilisateur');
  const amount = interaction.options.getInteger('montant');

  // Vérifications basiques
  if (!target || amount <= 0) {
    return interaction.reply({
      content: 'Usage : `/pay @utilisateur montant` (montant > 0).',
      ephemeral: false
    });
  }
  if (target.bot) {
    return interaction.reply({ content: 'Tu ne peux pas payer un bot.', ephemeral: false });
  }
  if (target.id === interaction.user.id) {
    return interaction.reply({ content: 'Tu ne peux pas te payer toi-même.', ephemeral: false });
  }

  // Prépare la base de données
  const dataDir = resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = resolve(dataDir, 'economy.sqlite');
  const sqlite = sqlite3.verbose();
  const db = new sqlite.Database(dbPath);

  db.serialize(() => {
    // Création de la table si nécessaire
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        userId TEXT PRIMARY KEY,
        balance INTEGER DEFAULT 0,
        lastDaily INTEGER DEFAULT 0,
        inventory TEXT DEFAULT '[]',
        levelUpMessage INTEGER DEFAULT 1
      )
    `);

    // Récupère le solde de l’expéditeur
    db.get(
      'SELECT balance FROM users WHERE userId = ?',
      [interaction.user.id],
      (err, rowSender) => {
        if (err) {
          console.error(err);
          db.close();
          return interaction.reply({ content: '❌ Erreur base de données.', ephemeral: false });
        }

        const senderBal = rowSender ? rowSender.balance : 0;
        if (senderBal < amount) {
          db.close();
          return interaction.reply({
            content: `Tu n'as pas assez de coins (solde : ${senderBal}).`,
            ephemeral: false
          });
        }

        // Débite l’expéditeur
        const newSenderBal = senderBal - amount;
        db.run(
          `
            INSERT INTO users(userId, balance)
            VALUES(?, ?)
            ON CONFLICT(userId) DO UPDATE SET balance = ?
          `,
          [interaction.user.id, newSenderBal, newSenderBal],
          errDebit => {
            if (errDebit) {
              console.error(errDebit);
              db.close();
              return interaction.reply({ content: '❌ Impossible de mettre à jour ton solde.', ephemeral: false });
            }

            // Créditer le destinataire
            db.get(
              'SELECT balance FROM users WHERE userId = ?',
              [target.id],
              (err2, rowRec) => {
                if (err2) {
                  console.error(err2);
                  db.close();
                  return interaction.reply({ content: '❌ Erreur base de données.', ephemeral: false });
                }

                const recBal = rowRec ? rowRec.balance : 0;
                const newRecBal = recBal + amount;
                db.run(
                  `
                    INSERT INTO users(userId, balance)
                    VALUES(?, ?)
                    ON CONFLICT(userId) DO UPDATE SET balance = ?
                  `,
                  [target.id, newRecBal, newRecBal],
                  errCredit => {
                    db.close();
                    if (errCredit) {
                      console.error(errCredit);
                      return interaction.reply({
                        content: '❌ Impossible de mettre à jour le solde du destinataire.',
                        ephemeral: false
                      });
                    }

                    // Confirmation publique
                    interaction.reply({
                      content: `✅ ${interaction.user.tag} a envoyé **${amount} coins** à ${target.tag}.\n` +
                               `Ton solde : **${newSenderBal}**, solde de ${target.tag} : **${newRecBal}**.`,
                      ephemeral: false
                    });

                    // Log dans le salon de logs
                    const logChannel = interaction.guild?.channels.cache.get('1358548828004815399');
                    if (logChannel) {
                      logChannel.send(
                        `💸 ${interaction.user.tag} a payé ${amount} coins à ${target.tag}. ` +
                        `Solde expéditeur : ${newSenderBal}, solde destinataire : ${newRecBal}. • By Eniooo`
                      );
                    }
                  }
                );
              }
            );
          }
        );
      }
    );
  });
}
