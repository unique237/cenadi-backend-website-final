# 🌱 Seeders - Données initiales

Ce dossier contient les scripts de remplissage de la base de données avec des données initiales.

## 📁 Structure

```
seeders/
└── seed.js          # Script principal qui charge toutes les données initiales
```

## 🚀 Utilisation

### Charger les données initiales

```bash
npm run seed
```

### Charger une seule table

```bash
node src/seeders/seed.js --only users
```

### Vider la base de données (attention!)

```bash
npm run seed:reset
```

## 📋 Données chargées

Le seeder charge les données suivantes:

### 1. Utilisateurs (Users)

- Admin principal: `admin@cenadi.cm` / `SecureAdmin123`
- Auteurs pour tester la création d'articles

### 2. Catégories

- News & Updates
- Announcements
- Training
- Events

### 3. Articles

- Articles d'exemple avec images
- Références aux catégories
- Contenu bilingue (EN/FR)

### 4. Projets

- Projets actifs et complétés
- Descriptions et budgets

### 5. Faits & Statistiques

- Statistiques CENADI
- Icônes et descriptions

### 6. Personnel

- Membres du personnel
- Postes et contacts

### 7. Partenaires

- Partenaires institutionnels
- Logos et descriptions

### 8. Newsletters

- Newsletters de test
- Contenu bilingue

## 🔧 Ajouter des données

Pour ajouter de nouvelles données au seeder:

1. Éditez `src/seeders/seed.js`
2. Trouvez la section appropriée (ex: Users, Articles)
3. Ajoutez votre objet à l'array de données
4. Exécutez `npm run seed`

### Exemple

```javascript
// Dans src/seeders/seed.js

const users = [
  {
    username: "newadmin",
    email: "newadmin@cenadi.cm",
    password_hash: bcrypt.hashSync("password123", 10),
    name: "Nouvel Administrateur",
    role: "admin",
    status: "active",
  },
  // ... plus d'utilisateurs
];
```

## ⚠️ Important

- **Ne pas commiter les mots de passe en clair** dans le code
- Les mots de passe sont hashés avec bcrypt
- Les données de seeding doivent être anonymes/génériques
- Ne pas inclure de données personnelles réelles

## 🔐 Credentials de test

Après seeding, utilisez:

```
Email: admin@cenadi.cm
Password: SecureAdmin123
```

## 📚 Voir aussi

- [DEVELOPER_GUIDE.md](../docs/DEVELOPER_GUIDE.md) - Section Seeders
- [README.md](../README.md) - Section Installation
