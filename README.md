# ProtectMaster Ultimate Full

## 🛠️ Prérequis

- **Node.js** v16.9.0 ou supérieure
- **npm** (livré avec Node.js)

## 📥 Installation

1. Clonez ou dézippez le projet sur votre machine.
2. Ouvrez un terminal à la racine du projet.
3. Installez toutes les dépendances listées dans `package.json` :
   ```bash
   npm install
   ```
   Si besoin, installez manuellement les packages principaux :
   ```bash
   npm install discord.js @discordjs/rest @discordjs/builders dotenv sqlite3 weather-js node-fetch@2
   npm install express ejs socket.io socket.io-client express-session bcrypt
   ```

4. Créez un fichier `.env` à la racine et ajoutez-y :
   ```env
   # Token de votre bot Discord
   TOKEN=VotreTokenDiscord

   # ID de l'application (Client ID)
   CLIENT_ID=VotreClientID
   
   ```

## 🚀 Déploiement des Slash Commands

Avant de lancer le bot, enregistrez les commandes slash auprès de l’API Discord :
```bash
node bot/deploy-commands.js
``` 

## ▶️ Lancement du Bot

Démarrez le bot avec :
```bash
npm run bot
``` 
ou directement :
```bash
node bot/index.js
```

## 🖥️ Dashboard (Optionnel)

Si vous avez configuré la partie Dashboard, lancez-la avec :
```bash
npm run dashboard
```
Puis ouvrez : http://localhost:3000  dans votre navigateur.

## 📋 Commandes & Structure

- **Commandes Slash** : dans le dossier `bot/commands/`
- **Données** : stockage JSON et SQLite dans le dossier `data/`

Tapez `/help` dans Discord pour afficher la liste complète des commandes.

## ❓ Support

Pour toute question ou problème, contactez **eniooo_** ou ouvrez une issue sur le dépôt.
