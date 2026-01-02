# 🎮 Contrôleurs

Ce dossier contient la logique métier des endpoints API.

## 📁 Structure

```
controllers/
├── authController.js                # Authentification
├── userController.js                # Gestion des utilisateurs
├── newsController.v2.js             # Articles/News
├── projectController.v2.js          # Projets
├── factController.v2.js             # Faits & Statistiques
├── staffController.v2.js            # Personnel
├── partnerController.v2.js          # Partenaires
├── newsletterController.js          # Newsletters
├── ebookController.v2.js            # E-books
├── directorWordController.v2.js     # Messages directeur
├── ministerWordController.v2.js     # Messages ministre
└── ...autres contrôleurs
```

## 🔄 Pattern Contrôleur

Chaque contrôleur suit ce pattern:

```javascript
// GET all (avec pagination)
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const items = await Model.findAll({
      offset: (page - 1) * limit,
      limit: parseInt(limit)
    });
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET by ID
exports.getById = async (req, res) => {
  try {
    const item = await Model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, message: 'Créé', item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    await Model.update(req.body, { where: { id: req.params.id } });
    const item = await Model.findByPk(req.params.id);
    res.json({ success: true, message: 'Mis à jour', item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE
exports.delete = async (req, res) => {
  try {
    await Model.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Supprimé' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
```

## 📋 Conventions

1. **Nommage**: `${action}${Resource}` (ex: `createNews`, `getAllProjects`)
2. **Réponses**: Format standard `{ success, message, data }`
3. **Erreurs**: Codes HTTP appropriés (400, 401, 404, 500)
4. **Validation**: Vérifier avant traiter
5. **Logging**: Logger les erreurs importantes

## 🔐 Authentification

Pour les actions protégées:

```javascript
exports.protectedAction = async (req, res) => {
  // req.user contient les infos du token JWT
  const userId = req.user.user_id;
  // ... logique
};
```

## 📝 Bonnes pratiques

### ✅ À faire
```javascript
// Valider les données
if (!req.body.title) return res.status(400).json({ error: 'Title required' });

// Vérifier l'existence
const item = await Model.findByPk(id);
if (!item) return res.status(404).json({ error: 'Not found' });

// Gérer les erreurs
try { ... } catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
```

### ❌ À éviter
```javascript
// Ne pas retourner les mots de passe
res.json(user); // ❌ Contient password_hash

// Ne pas exposer les details d'erreur
res.json(error); // ❌ Trop d'infos sensibles

// Ne pas faire confiance au client
await Model.destroy({ where: {} }); // ❌ Supprime tout!
```

## 🧪 Testing

Chaque contrôleur devrait avoir des tests dans `src/__tests__/`:

```javascript
describe('newsController', () => {
  it('should get all news', async () => {
    const req = {};
    const res = { json: jest.fn() };
    
    await getAllNews(req, res);
    
    expect(res.json).toHaveBeenCalled();
  });
});
```

## 📚 Voir aussi

- [models/README.md](../models/README.md) - Modèles Sequelize
- [routes/README.md](../routes/README.md) - Routes API
- [docs/DEVELOPER_GUIDE.md](../../docs/DEVELOPER_GUIDE.md) - Patterns détaillés
