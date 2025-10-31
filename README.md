# Invader Comparator

Application web pour comparer les collections Space Invaders entre joueurs, avec un backoffice d'administration dockerisé.

## Architecture du Projet

Le projet est divisé en 2 applications :

### 1. Frontend (Port 3000)
Application Vue.js principale avec authentification Google intégrée permettant de :
- Comparer les collections d'invaders entre différents joueurs
- Gérer ses UIDs personnels et ceux des autres joueurs
- Se connecter/déconnecter avec Google OAuth

**Technologies :**
- Vue 3 avec Composition API
- TypeScript
- Vite
- Vitest pour les tests

### 2. Backend (Port 3001)
API REST Node.js avec authentification Google OAuth pour gérer les utilisateurs et leurs UIDs.

**Technologies :**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Passport.js (Google OAuth)
- Sessions avec connect-mongo

## Prérequis

- Node.js v20.19.0 ou >= v22.12.0
- Docker et Docker Compose
- Compte Google Cloud Platform (pour OAuth)

## Configuration Google OAuth

1. Accédez à [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Configurez l'écran de consentement OAuth :
   - Dans "APIs et services" > "Écran de consentement OAuth"
   - Type d'utilisateur : Externe (ou Interne si G Workspace)
   - Ajoutez les scopes : `.../auth/userinfo.email` et `.../auth/userinfo.profile`
4. Dans "Identifiants", créez des identifiants OAuth 2.0 :
   - Cliquez sur "Créer des identifiants" > "ID client OAuth 2.0"
   - Type : Application Web
   - Origines JavaScript autorisées : `http://localhost:3000`
   - URI de redirection autorisée : `http://localhost:3001/api/auth/google/callback`
5. Notez le **Client ID** et le **Client Secret**

## Installation

### 1. Cloner le repository

```bash
git clone <repository-url>
cd invader-comparator
```

### 2. Configurer les variables d'environnement

```bash
cp .env.docker .env
```

Éditez le fichier `.env` et configurez :

```env
# Générez une clé aléatoire sécurisée
SESSION_SECRET=<votre-secret-session>

# Credentials Google OAuth
GOOGLE_CLIENT_ID=<votre-client-id>
GOOGLE_CLIENT_SECRET=<votre-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# URL du frontend pour la redirection après connexion
FRONTEND_URL=http://localhost:3000
```

Pour générer un SESSION_SECRET sécurisé :
```bash
openssl rand -base64 32
```

### 3. Installer les dépendances (optionnel pour développement local)

```bash
# Frontend principal
cd frontend
npm install
cd ..

# Backend
cd backend
npm install
cd ..
```

## Démarrage avec Docker (Recommandé)

### Lancer tous les services

```bash
docker compose --env-file .env up -d
```

### Vérifier le statut des services

```bash
docker compose ps
```

### Voir les logs

```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo
```

### Arrêter les services

```bash
docker compose down
```

### Reconstruire les images après modification

```bash
docker compose build
docker compose up -d
```

### Supprimer les volumes (réinitialiser la base de données)

```bash
docker compose down -v
```

## Accès aux Applications

Une fois les services démarrés :

- **Frontend Principal** : http://localhost:3000
- **Backend API** : http://localhost:3001
- **MongoDB** : localhost:27017

## Développement Local (sans Docker)

### Frontend Principal

```bash
cd frontend
npm install
npm run dev
```

Accessible sur http://localhost:5173

### Backend API

```bash
cd backend
npm install
cp .env.example .env
# Éditez .env avec vos credentials
npm run dev
```

Accessible sur http://localhost:3001

**Note :** Pour le développement local, assurez-vous que MongoDB est disponible. Modifiez `MONGODB_URI` dans `.env` si nécessaire :
```env
MONGODB_URI=mongodb://localhost:27017/invader-comparator
```

## Structure du Projet

```
.
├── frontend/                    # Application principale Vue.js
│   ├── src/
│   │   ├── api/                # Services API
│   │   ├── atoms/              # Composants atomiques
│   │   ├── molecules/          # Composants moléculaires
│   │   ├── __tests__/          # Tests unitaires
│   │   ├── App.vue             # Composant racine
│   │   └── main.ts             # Point d'entrée
│   ├── public/                 # Assets statiques
│   ├── Dockerfile              # Image Docker frontend
│   ├── nginx.conf              # Configuration Nginx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # API Node.js/Express
│   ├── src/
│   │   ├── config/             # Configuration (Passport)
│   │   ├── models/             # Modèles Mongoose
│   │   ├── routes/             # Routes API
│   │   └── server.ts           # Serveur Express
│   ├── Dockerfile              # Image Docker backend
│   ├── .env.example            # Template variables env
│   └── package.json
│
├── docker compose.yml           # Orchestration Docker
├── .env.docker                  # Template variables env Docker
├── .gitignore
└── README.md                    # Ce fichier
```

## API Endpoints

### Authentification

- `GET /api/auth/google` - Initie l'authentification Google OAuth
- `GET /api/auth/google/callback` - Callback OAuth après authentification
- `GET /api/auth/status` - Vérifie le statut d'authentification de l'utilisateur
- `POST /api/auth/logout` - Déconnecte l'utilisateur

### Gestion des UIDs (authentification requise)

- `GET /api/uids` - Récupère les UIDs de l'utilisateur connecté
- `PUT /api/uids/my-uid` - Met à jour l'UID personnel
  ```json
  { "uid": "627F176F-54C3-4D32-90EF-C4C80462A2C3" }
  ```
- `PUT /api/uids/others-uids` - Met à jour la liste complète des UIDs des autres
  ```json
  { "uids": ["uid1", "uid2", "uid3"] }
  ```
- `POST /api/uids/others-uids` - Ajoute un UID à la liste
  ```json
  { "uid": "FAFDC163-BD97-4372-A647-1A063028E579" }
  ```
- `DELETE /api/uids/others-uids/:uid` - Supprime un UID de la liste

## Utilisation de l'Application

### Connexion

1. Accédez à http://localhost:3000
2. Cliquez sur "Se connecter avec Google" en haut à droite
3. Autorisez l'application à accéder à votre profil Google
4. Vous serez redirigé vers l'application avec votre menu de paramètres

### Gérer vos UIDs

Une fois connecté, cliquez sur "Paramètres" pour ouvrir le menu latéral :

**Mon UID :**
- Entrez votre identifiant unique Space Invaders
- Cliquez sur "Enregistrer mon UID"
- Votre UID sera sauvegardé dans la base de données

**UIDs des autres joueurs :**
- Entrez un UID dans le champ de saisie
- Cliquez sur "Ajouter" ou appuyez sur Entrée
- Pour supprimer un UID, cliquez sur "Supprimer" à côté de l'UID
- Tous les changements sont automatiquement sauvegardés

### Déconnexion

Cliquez sur "Déconnexion" dans le header pour vous déconnecter.

## Scripts NPM Disponibles

### Frontend

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run test:unit    # Tests unitaires
npm run lint         # Linter ESLint
npm run format       # Format avec Prettier
```

### Backend

```bash
npm run dev          # Serveur de développement avec hot-reload
npm run build        # Compilation TypeScript
npm start            # Démarrage en production
```

## Tests

### Tests unitaires (Frontend)

```bash
cd frontend
npm run test:unit
```

## Dépannage

### MongoDB ne démarre pas

Vérifiez les logs :
```bash
docker compose logs mongo
```

Vérifiez que le port 27017 n'est pas déjà utilisé :
```bash
lsof -i :27017
```

### Backend ne démarre pas

Vérifiez que toutes les variables d'environnement sont définies dans `.env` :
```bash
docker compose logs backend
```

### Erreur d'authentification Google

Vérifiez que :
- Les credentials Google sont corrects dans `.env`
- L'URI de redirection correspond exactement à celle configurée dans Google Cloud Console
- L'écran de consentement OAuth est bien configuré avec les scopes nécessaires

### Ports déjà utilisés

Si les ports 3000, 3001, ou 3002 sont déjà utilisés, modifiez les dans `docker compose.yml` :

```yaml
ports:
  - "NOUVEAU_PORT:PORT_INTERNE"
```

N'oubliez pas de mettre à jour également :
- `GOOGLE_CALLBACK_URL` dans `.env`
- `FRONTEND_URL` dans `.env`

### Réinitialiser complètement le projet

```bash
# Arrêter et supprimer tous les conteneurs et volumes
docker compose down -v

# Supprimer les images
docker compose rm -f
docker rmi invader-comparator-frontend invader-comparator-backend invader-comparator-admin

# Reconstruire et redémarrer
docker compose build --no-cache
docker compose up -d
```

## Déploiement en Production

Pour un déploiement en production, considérez :

1. **HTTPS** : Utilisez un certificat SSL/TLS valide
2. **Variables d'environnement** : Utilisez des secrets sécurisés (pas de fichier .env)
3. **Base de données** : 
   - Ajoutez l'authentification MongoDB
   - Utilisez un service MongoDB managé (MongoDB Atlas, etc.)
4. **CORS** : Configurez les origines autorisées dans le backend
5. **Reverse Proxy** : Utilisez Nginx ou Traefik devant les services
6. **Google OAuth** : Mettez à jour les URIs avec votre domaine de production
7. **Logs** : Configurez un système de logging centralisé
8. **Monitoring** : Ajoutez des outils de monitoring (Prometheus, Grafana, etc.)
9. **Backups** : Planifiez des sauvegardes régulières de MongoDB

### Exemple de configuration production

```yaml
# docker compose.prod.yml
services:
  backend:
    environment:
      - NODE_ENV=production
      - SESSION_SECRET=${SESSION_SECRET}
      - MONGODB_URI=${MONGODB_URI}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
      - FRONTEND_URL=https://yourdomain.com
```

## Technologies Utilisées

- **Frontend** : Vue 3, TypeScript, Vite
- **Backend** : Node.js, Express, TypeScript
- **Base de données** : MongoDB
- **Authentification** : Passport.js avec Google OAuth 2.0
- **Conteneurisation** : Docker, Docker Compose
- **Serveur Web** : Nginx (pour servir les applications en production)

## Contribution

Les contributions sont les bienvenues. Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT.

## Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation dans le dossier `/docs`
- Contactez l'équipe de développement
