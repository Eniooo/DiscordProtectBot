import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Affiche la liste des commandes disponibles');

export async function execute(interaction) {
  await interaction.reply({
    ephemeral: true,
    content: `📖 **Commandes disponibles :**

🛡️ **Modération**
• \`/kick\` – Expulse un membre
• \`/ban\` – Bannit un membre
• \`/mute\` – Réduit un membre au silence
• \`/timeout\` – Met un membre en timeout
• \`/clear\` – Supprime des messages
• \`/warn\` – Avertit un membre
• \`/infractions\` – Liste les avertissements d’un membre
• \`/note\` – Ajoute une note interne
• \`/modlogs\` – Affiche les logs de modération
• \`/modpanel\` – Ouvre le panneau de modération

🔧 **Configuration & Protection**
• \`/config\` – Active ou désactive un module
• \`/antiraid\` – Active/désactive la protection anti-raid

🎮 **Économie**
• \`/balance\` – Affiche ton solde
• \`/daily\` – Réclame ta récompense journalière
• \`/pay\` – Transfère des coins à un utilisateur
• \`/inventory\` – Affiche ton inventaire
• \`/levelup-message\` – Toggle message de montée de niveau

💬 **Utilitaires**
• \`/roleinfo\` – Infos sur un rôle
• \`/userinfo\` – Infos sur un utilisateur
• \`/serverinfo\` – Infos sur le serveur
• \`/status\` – Statut du bot
• \`/weather\` – Météo pour une ville
• \`/config\` – Configurer les modules

😂 **Fun**
• \`/8ball\` – Répond à une question
• \`/blague\` – Envoie une blague
• \`/pileface\` – Pile ou face
• \`/cat\` – Image de chat aléatoire
• \`/dog\` – Image de chien aléatoire
• \`/meme\` – Envoie un mème Reddit
• \`/quote\` – Citation inspirante

🎯 **Bienvenue & Départ**
• \`/welcome\` – Définit ou désactive le message de bienvenue
• \`/goodbye\` – Définit ou désactive le message d’au revoir

🔍 **Modération avancée**
• \`/lock\` – Verrouille le salon actuel
• \`/unlock\` – Déverrouille le salon actuel
• \`/slowmode\` – Configure le slowmode du salon
• \`/purge\` – Supprime les messages d’un utilisateur

❓ **Autres**
• \`/help\` – Affiche cette aide
    `
  });
}
