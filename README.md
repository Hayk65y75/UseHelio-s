  # 🤖 Application: Helio's [V1.0.0]

![Dernière version]([https://img.shields.io/github/v/release/votre-utilisateur/votre-projet](https://img.shields.io/github/v/release/Hayk65y75/UseHelio-s))

## 📋 Prérequis

- [Node.js](https://nodejs.org/) (version 20.x ou supérieure)
- Un token de bot Discord
- Un ID d'application Discord
- Un serveur Discord pour le développement

## 🚀 Installation

1. Clonez le repository :
```bash
git clone https://github.com/Hayk65y75/UseHelio-s.git
cd UseHelio-s
```

2. Configurez les variables d'environnement :
```bash
# Renommez le fichier d'exemple
mv .env.example .env
```

3. Ouvrez le fichier `.env` et remplissez les informations suivantes :
```env
DISCORD_TOKEN=votre_token_discord
CLIENT_ID=votre_client_id
DEV_GUILD_ID=id_de_votre_serveur
```

4. Installez les dépendances :
```bash
# Reconstruction des modules
npm rebuild
```

5. Lancez le bot :
```bash
node index.js
```

## ⚙️ Configuration

Pour obtenir les informations nécessaires à la configuration :

1. Créez une application sur le [Portail Développeur Discord](https://discord.com/developers/applications)
2. Dans l'onglet "Bot", créez un bot et copiez le token
3. Copiez l'ID de l'application (CLIENT_ID)
4. Activez les "Privileged Gateway Intents" nécessaires
5. Invitez le bot sur votre serveur de développement et copiez l'ID du serveur (DEV_GUILD_ID)

## 📝 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
