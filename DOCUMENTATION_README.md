# 🎯 Accès à la Documentation API CENADI

## 📍 Points d'accès rapides

### 🌐 Interface Interactive Swagger
**Lien**: `http://localhost:5001/api-docs`

Avec cette interface vous pouvez:
- ✅ Voir tous les endpoints
- ✅ Lire la description de chaque endpoint
- ✅ Voir les schémas de réponse
- ✅ Tester les endpoints directement
- ✅ Voir les codes d'erreur

### 📚 Documentation Complète

| Document | Description | Pour qui |
|----------|-------------|----------|
| **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | Référence complète des endpoints, authentification, codes de réponse, exemples | Développeurs frontend, intégrateurs |
| **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** | Guide pour développer avec l'API, créer de nouveaux endpoints, tester | Développeurs backend |
| **[SWAGGER_GUIDE.md](SWAGGER_GUIDE.md)** | Guide pour maintenir la documentation Swagger/OpenAPI | Mainteneurs documentation |
| **[DOCUMENTATION_UPDATE_SUMMARY.md](DOCUMENTATION_UPDATE_SUMMARY.md)** | Résumé des mises à jour de la documentation | Tous |

## 🚀 Démarrage rapide

### 1️⃣ Démarrer le serveur

```bash
cd cenadi-backend-website-final
npm install
npm run dev
```

### 2️⃣ Accéder à Swagger UI

Ouvrir dans le navigateur:
```
http://localhost:5001/api-docs
```

### 3️⃣ Se connecter

1. Aller à `/auth/signin`
2. Cliquer sur "Try it out"
3. Entrer les credentials:
   ```json
   {
     "email": "admin@cenadi.cm",
     "password": "SecureAdmin123"
   }
   ```
4. Exécuter et copier le `token`
5. Cliquer sur le bouton "Authorize" (en haut à droite)
6. Entrer: `Bearer <token>`

### 4️⃣ Tester des endpoints

Vous pouvez maintenant:
- ✅ Récupérer la liste des articles: `GET /news`
- ✅ Récupérer la liste des faits: `GET /facts`
- ✅ Créer un nouvel article: `POST /news`
- ✅ Etc.

## 📖 Lecture recommandée

### Pour consommer l'API:
1. Lire la section "Authentification" dans **API_DOCUMENTATION.md**
2. Consulter la section "Endpoints" pour votre cas d'usage
3. Utiliser Swagger UI pour tester

### Pour développer des endpoints:
1. Lire **DEVELOPER_GUIDE.md** au complet
2. Suivre le guide "Créer un nouveau endpoint"
3. Ajouter les annotations Swagger en suivant **SWAGGER_GUIDE.md**

### Pour maintenir la doc:
1. Lire **SWAGGER_GUIDE.md**
2. Comprendre la structure OpenAPI 3.0
3. Vérifier avec le validateur OpenAPI

## 🔍 Trouver un endpoint

### Méthode 1: Via Swagger UI
1. Ouvrir `http://localhost:5001/api-docs`
2. Chercher par tag (News, Facts, Users, etc.)
3. Cliquer sur l'endpoint

### Méthode 2: Via fichier markdown
1. Ouvrir **API_DOCUMENTATION.md**
2. Ctrl+F pour chercher ("articles", "facts", etc.)
3. Lire la documentation

### Méthode 3: Via fichier de routes
1. Ouvrir `src/routes/newsRoutes.js` (par exemple)
2. Voir les annotations `@swagger` au-dessus de chaque route

## 🧪 Tester avec Postman

### Importer automatiquement
1. Ouvrir Postman
2. Cliquer sur "Import"
3. Entrer l'URL: `http://localhost:5001/api-docs`
4. Cliquer "Continue" puis "Import"

### Configuration manuelle
1. Créer une collection "CENADI API"
2. Ajouter les endpoints manuellement
3. Pour chaque endpoint:
   - Copier l'URL depuis Swagger UI
   - Ajouter les paramètres
   - Ajouter le header `Authorization: Bearer <token>`

### Variables d'environnement
Créer un environment Postman:
```json
{
  "base_url": "http://localhost:5001/api",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin_email": "admin@cenadi.cm",
  "admin_password": "SecureAdmin123"
}
```

## 📊 Statistiques de la documentation

| Métrique | Valeur |
|----------|--------|
| Endpoints documentés | 40+ |
| Schémas OpenAPI | 16 |
| Exemples fournis | 50+ |
| Lignes de documentation | 2000+ |
| Fichiers d'aide | 4 |
| Tags de catégorisation | 11 |
| Modèles métier | 14 |
| Codes d'erreur documentés | 10+ |

## 🆘 Besoin d'aide?

### Erreur "Non authentifié (401)"
→ Vous n'avez pas fourni le token. Voir section "Authentification" dans API_DOCUMENTATION.md

### Erreur "Accès refusé (403)"
→ Vous n'avez pas les permissions. Les opérations POST/PUT/DELETE nécessitent un compte Admin

### Endpoint ne fonctionne pas?
→ Vérifier dans Swagger UI:
1. Paramètres requis fournis?
2. Authentification correcte?
3. Données au bon format?

### Documentation confuse?
→ Consulter en cet ordre:
1. API_DOCUMENTATION.md pour la vue d'ensemble
2. Swagger UI pour le détail technique
3. DEVELOPER_GUIDE.md pour des exemples de code

## 🔄 Workflow typique

### 1. Consommer l'API depuis un frontend

```
1. Lire API_DOCUMENTATION.md (section Authentification)
2. Implémenter POST /auth/signin pour récupérer le token
3. Stocker le token (localStorage, sessionStorage, etc.)
4. Ajouter token en header: Authorization: Bearer <token>
5. Appeler les endpoints (GET /news, POST /facts, etc.)
6. Gérer les erreurs selon les codes retournés
```

### 2. Ajouter un nouvel endpoint

```
1. Créer le modèle Sequelize dans src/models/
2. Créer le contrôleur dans src/controllers/
3. Créer les routes avec annotations JSDoc
4. Ajouter les schémas dans src/config/swagger.js
5. Ajouter les tags si nécessaire
6. Redémarrer le serveur
7. Vérifier dans Swagger UI http://localhost:5001/api-docs
8. Mettre à jour API_DOCUMENTATION.md
```

### 3. Modifier une réponse d'API

```
1. Modifier le contrôleur (src/controllers/)
2. Mettre à jour l'annotation @swagger dans les routes
3. Mettre à jour le schéma dans src/config/swagger.js
4. Redémarrer le serveur
5. Vérifier dans Swagger UI
6. Mettre à jour API_DOCUMENTATION.md
```

## 📁 Structure des fichiers

```
cenadi-backend-website-final/
├── API_DOCUMENTATION.md              ← Référence API complète
├── DEVELOPER_GUIDE.md                ← Guide développeur
├── SWAGGER_GUIDE.md                  ← Guide Swagger
├── DOCUMENTATION_UPDATE_SUMMARY.md   ← Résumé des mises à jour
├── src/
│   ├── config/
│   │   └── swagger.js               ← Configuration OpenAPI
│   ├── controllers/                 ← Logique métier
│   ├── models/                      ← Modèles Sequelize
│   ├── routes/                      ← Routes + annotations Swagger
│   └── server.js
└── package.json
```

## 🎯 Prochaines étapes

1. ✅ Lire la documentation (30 min)
2. ✅ Tester les endpoints dans Swagger UI (15 min)
3. ✅ Importer dans Postman (5 min)
4. ✅ Implémenter l'authentification dans votre app
5. ✅ Appeler les endpoints depuis votre app
6. ✅ Gérer les erreurs et les réponses

## 📞 Support

Pour des questions:
- Consulter les documents markdown
- Vérifier la Swagger UI
- Lire les commentaires du code
- Contacter: `info@cenadi.cm`

---

**Documentation mise à jour**: 2 janvier 2026  
**Version API**: 2.0.0  
**Statut**: ✅ Complète et à jour
