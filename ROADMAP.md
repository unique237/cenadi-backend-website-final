# 🗓️ PROGRAMME DE MISE À JOUR - CENADI Backend

**Date de création:** 31 décembre 2025  
**Statut:** En cours

---

## ✅ PHASE 1 - ACTIONS IMMÉDIATES (TERMINÉ)

### Sécurité Critique

- [x] Corriger la typo dans `smtp_contact.js` (`rquire` → `require`)
- [x] Ajouter et configurer CORS dans `server.js`
- [x] Créer le fichier `.env` avec configurations de base
- [x] Documenter le projet dans `README.md`

**Durée estimée:** ✅ 30 minutes - **TERMINÉ**

---

## 🔥 PHASE 2 - SÉCURITÉ HAUTE PRIORITÉ (À FAIRE MAINTENANT)

### 2.1 Rate Limiting (1h)

```bash
npm install express-rate-limit
```

- [ ] Créer `src/middleware/rateLimiter.js`
- [ ] Configurer des limites globales (100 req/15min)
- [ ] Configurer des limites strictes pour auth (5 req/15min)
- [ ] Appliquer dans `server.js`

### 2.2 Helmet - Headers de Sécurité (30min)

```bash
npm install helmet
```

- [ ] Installer et configurer Helmet
- [ ] Appliquer dans `server.js`
- [ ] Tester les headers de sécurité

### 2.3 Validation des Inputs (2h)

```bash
npm install joi
```

- [ ] Créer `src/middleware/validation.js`
- [ ] Créer schémas de validation pour signup/signin
- [ ] Créer schémas pour contact/subscribe
- [ ] Appliquer aux routes existantes

### 2.4 Amélioration JWT (1h)

- [ ] Supprimer le fallback `'your-secret-key'` dans auth.js
- [ ] Ajouter validation de JWT_SECRET au démarrage
- [ ] Ajouter refresh tokens (optionnel)
- [ ] Implémenter blacklist des tokens (optionnel)

**Durée estimée:** 4h30

---

## 🛠️ PHASE 3 - IMPLÉMENTATIONS MANQUANTES (3-5 jours)

### 3.1 Middleware Upload (2h)

- [ ] Configurer Multer dans `src/middleware/upload.js`
- [ ] Définir stratégies de stockage (disk/memory)
- [ ] Ajouter validation des types de fichiers
- [ ] Limiter la taille des uploads
- [ ] Créer dossier `uploads/` avec .gitkeep

### 3.2 Contrôleurs Principaux (1 jour)

- [ ] **newsController.js** - CRUD articles/actualités
  - [ ] getAllNews
  - [ ] getNewsById
  - [ ] createNews (author/admin)
  - [ ] updateNews (author/admin)
  - [ ] deleteNews (admin)
- [ ] **projectController.js** - CRUD projets

  - [ ] getAllProjects
  - [ ] getProjectById
  - [ ] createProject (admin)
  - [ ] updateProject (admin)
  - [ ] deleteProject (admin)

- [ ] **categoryControllers.js** - Gestion catégories
  - [ ] getAllCategories
  - [ ] getCategoryById
  - [ ] createCategory (admin)
  - [ ] updateCategory (admin)
  - [ ] deleteCategory (admin)

### 3.3 Contrôleurs Secondaires (1 jour)

- [ ] **staffController.js** - Équipe/Personnel
- [ ] **partnerController.js** - Partenaires
- [ ] **factController.js** - Statistiques/Faits
- [ ] **ebookController.js** - eBooks/Documents
- [ ] **directorWordController.js** - Message du directeur
- [ ] **ministerWordController.js** - Message du ministre
- [ ] **assetController.js** - Gestion fichiers statiques

### 3.4 Routes Correspondantes (4h)

- [ ] Créer `newsRoutes.js`
- [ ] Créer `projectRoutes.js`
- [ ] Créer `categoryRoutes.js`
- [ ] Créer `staffRoutes.js`
- [ ] Créer `partnerRoutes.js`
- [ ] Créer autres routes nécessaires
- [ ] Importer toutes les routes dans `server.js`

**Durée estimée:** 3-5 jours

---

## 📊 PHASE 4 - QUALITÉ DE CODE (2-3 jours)

### 4.1 Logging Centralisé (3h)

```bash
npm install winston morgan
```

- [ ] Créer `src/config/logger.js` avec Winston
- [ ] Configurer niveaux de logs (error, warn, info, debug)
- [ ] Créer rotation des fichiers logs
- [ ] Ajouter Morgan pour logs HTTP
- [ ] Remplacer tous les console.log/error

### 4.2 Gestion d'Erreurs (4h)

- [ ] Créer `src/middleware/errorHandler.js`
- [ ] Créer classes d'erreurs personnalisées
- [ ] Centraliser la gestion des erreurs
- [ ] Éviter l'exposition d'informations sensibles
- [ ] Appliquer dans tous les contrôleurs

### 4.3 Couche Service (1 jour)

- [ ] Créer `src/services/` directory
- [ ] Extraire la logique métier des contrôleurs
- [ ] Créer `userService.js`
- [ ] Créer `emailService.js`
- [ ] Créer autres services selon besoins

### 4.4 Configuration ESLint + Prettier (1h)

```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier
```

- [ ] Créer `.eslintrc.js`
- [ ] Créer `.prettierrc`
- [ ] Configurer les règles
- [ ] Ajouter scripts npm (`lint`, `format`)
- [ ] Corriger les erreurs de linting

**Durée estimée:** 2-3 jours

---

## 🧪 PHASE 5 - TESTS (3-4 jours)

### 5.1 Configuration Tests (2h)

```bash
npm install -D jest supertest @types/jest
```

- [ ] Configurer Jest (`jest.config.js`)
- [ ] Créer structure `tests/` ou `__tests__/`
- [ ] Configurer base de données de test
- [ ] Créer helpers et fixtures

### 5.2 Tests Unitaires (1.5 jours)

- [ ] Tests middleware (auth, validation)
- [ ] Tests services
- [ ] Tests utilitaires
- [ ] Viser 70%+ de couverture

### 5.3 Tests d'Intégration (1.5 jours)

- [ ] Tests routes authentification
- [ ] Tests routes utilisateurs
- [ ] Tests routes contact/subscribe
- [ ] Tests routes CRUD (news, projects, etc.)
- [ ] Tests gestion d'erreurs

### 5.4 Tests E2E (optionnel) (1 jour)

- [ ] Scénarios complets utilisateur
- [ ] Tests de charge basiques

**Durée estimée:** 3-4 jours

---

## 🗄️ PHASE 6 - BASE DE DONNÉES (1-2 jours)

### 6.1 Migrations (1 jour)

```bash
npm install db-migrate db-migrate-pg
```

- [ ] Configurer db-migrate
- [ ] Convertir db.sql en migrations
- [ ] Créer migrations pour évolutions futures
- [ ] Documenter processus de migration

### 6.2 Seeders (4h)

- [ ] Créer données de test
- [ ] Créer utilisateur admin par défaut
- [ ] Créer catégories initiales
- [ ] Script d'initialisation complète

### 6.3 Optimisation (4h)

- [ ] Ajouter indexes sur colonnes recherchées
- [ ] Configurer pool de connexions (min/max, idle)
- [ ] Implémenter transactions pour opérations critiques
- [ ] Gestion reconnexion automatique

**Durée estimée:** 1-2 jours

---

## 📚 PHASE 7 - DOCUMENTATION API (2 jours)

### 7.1 Swagger/OpenAPI (1 jour)

```bash
npm install swagger-jsdoc swagger-ui-express
```

- [ ] Configurer Swagger
- [ ] Documenter tous les endpoints
- [ ] Ajouter exemples de requêtes/réponses
- [ ] Ajouter schémas de données
- [ ] Route `/api-docs` pour documentation interactive

### 7.2 Documentation Additionnelle (1 jour)

- [ ] Mettre à jour README.md avec endpoints complets
- [ ] Créer CONTRIBUTING.md
- [ ] Créer CHANGELOG.md
- [ ] Documenter architecture dans docs/
- [ ] Créer guide de déploiement

**Durée estimée:** 2 jours

---

## 🚀 PHASE 8 - FONCTIONNALITÉS AVANCÉES (3-5 jours)

### 8.1 Pagination & Filtres (1 jour)

- [ ] Créer middleware de pagination
- [ ] Ajouter filtres pour listes
- [ ] Ajouter tri dynamique
- [ ] Ajouter recherche fulltext

### 8.2 Cache Redis (optionnel) (1 jour)

```bash
npm install redis
```

- [ ] Installer et configurer Redis
- [ ] Cache pour requêtes fréquentes
- [ ] Invalidation intelligente du cache
- [ ] Monitoring du cache

### 8.3 Upload Avancé (1 jour)

- [ ] Intégration cloud storage (AWS S3 / Azure Blob)
- [ ] Resize/optimisation images
- [ ] Génération de thumbnails
- [ ] CDN pour les assets

### 8.4 Emails Avancés (1 jour)

- [ ] Templates d'emails professionnels
- [ ] Queue d'envoi (Bull/Bee-Queue)
- [ ] Retry automatique
- [ ] Tracking d'ouverture/clic (optionnel)

**Durée estimée:** 3-5 jours

---

## 🐳 PHASE 9 - DEVOPS (2-3 jours)

### 9.1 Docker (1 jour)

- [ ] Créer `Dockerfile` optimisé (multi-stage)
- [ ] Créer `docker-compose.yml` (app + postgres + redis)
- [ ] Créer `.dockerignore`
- [ ] Tester build et déploiement local

### 9.2 CI/CD (1 jour)

- [ ] Configurer GitHub Actions / GitLab CI
- [ ] Pipeline: lint → test → build → deploy
- [ ] Variables d'environnement sécurisées
- [ ] Déploiement automatique (staging/prod)

### 9.3 Monitoring & Logging (1 jour)

- [ ] Intégration APM (PM2/New Relic/Datadog)
- [ ] Alertes erreurs critiques
- [ ] Dashboard de métriques
- [ ] Health checks avancés

**Durée estimée:** 2-3 jours

---

## 📋 CHECKLIST FINALE PRE-PRODUCTION

### Sécurité

- [ ] Toutes les variables .env sont configurées
- [ ] JWT_SECRET est un secret fort (32+ caractères aléatoires)
- [ ] Rate limiting actif sur toutes les routes
- [ ] Helmet configuré correctement
- [ ] CORS restreint aux domaines autorisés
- [ ] Validation sur tous les inputs
- [ ] Pas de données sensibles dans les logs
- [ ] HTTPS activé (certificat SSL)

### Code

- [ ] Tests passent à 100%
- [ ] Couverture de code > 70%
- [ ] Linting sans erreurs
- [ ] Pas de console.log en production
- [ ] Gestion d'erreurs centralisée
- [ ] Documentation API complète

### Base de Données

- [ ] Backups automatiques configurés
- [ ] Indexes optimisés
- [ ] Migrations testées
- [ ] Connection pool configuré

### Performance

- [ ] Tests de charge effectués
- [ ] Cache configuré (si applicable)
- [ ] Assets optimisés
- [ ] Pagination sur toutes les listes

### Déploiement

- [ ] Docker testé
- [ ] CI/CD fonctionnel
- [ ] Variables d'environnement production
- [ ] Monitoring actif
- [ ] Logs centralisés
- [ ] Rollback plan documenté

---

## 📊 ESTIMATION TOTALE

| Phase   | Durée      | Priorité |
| ------- | ---------- | -------- |
| Phase 1 | ✅ Terminé | Critique |
| Phase 2 | 4-5h       | Critique |
| Phase 3 | 3-5 jours  | Haute    |
| Phase 4 | 2-3 jours  | Haute    |
| Phase 5 | 3-4 jours  | Moyenne  |
| Phase 6 | 1-2 jours  | Moyenne  |
| Phase 7 | 2 jours    | Moyenne  |
| Phase 8 | 3-5 jours  | Basse    |
| Phase 9 | 2-3 jours  | Moyenne  |

**TOTAL:** 18-27 jours de développement

---

## 🎯 ROADMAP SUGGÉRÉE

### Sprint 1 (Semaine 1)

- Phase 2: Sécurité haute priorité
- Phase 3: Contrôleurs essentiels (news, projects)

### Sprint 2 (Semaine 2)

- Phase 3: Contrôleurs restants
- Phase 4: Qualité de code (logging, erreurs)

### Sprint 3 (Semaine 3)

- Phase 5: Tests unitaires et intégration
- Phase 6: Base de données (migrations)

### Sprint 4 (Semaine 4)

- Phase 7: Documentation API
- Phase 9: Docker + CI/CD basique

### Sprints suivants (selon priorités)

- Phase 8: Fonctionnalités avancées
- Phase 9: Monitoring avancé
- Optimisations continues

---

## 📝 NOTES

- Adapter les priorités selon les besoins métier
- Chaque phase peut être décomposée en tâches plus petites
- Faire des commits atomiques et des PR pour chaque feature
- Documenter au fur et à mesure
- Tester régulièrement en environnement proche de la production

---

**Prochaine étape:** Démarrer Phase 2 - Sécurité Haute Priorité
