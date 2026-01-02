# Système de Gestion des Images

Ce document décrit le système d'upload d'images mis en place pour le projet CENADI.

## Architecture

### Backend

#### 1. Configuration du Stockage (`src/config/storage.js`)
```javascript
- UPLOAD_BASE_DIR: 'uploads/' (dossier racine)
- MAX_FILE_SIZE: 5MB
- ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
- Fonction generateFileName(): génère un nom unique avec timestamp
- Fonction initStorageDirs(): crée la structure de dossiers
```

Structure des dossiers créés automatiquement:
```
uploads/
├── partners/
├── newsletters/
├── news/
├── projects/
├── staff/
├── ebooks/
└── assets/
```

#### 2. Middleware d'Upload (`src/middleware/upload.js`)
- Utilise **Multer** pour gérer les uploads multipart/form-data
- Stockage sur disque avec `multer.diskStorage`
- Validation des types de fichiers (fileFilter)
- Limitation de la taille (5MB max)
- Gestion des erreurs d'upload

#### 3. Routes d'Upload (`src/routes/uploadRoutes.js`)
Endpoints disponibles:
- `POST /api/upload/partners` - Upload logo partenaire
- `POST /api/upload/newsletters` - Upload image newsletter
- `POST /api/upload/news` - Upload image actualité
- `POST /api/upload/projects` - Upload image projet
- `POST /api/upload/staff` - Upload photo personnel
- `POST /api/upload/ebooks` - Upload couverture ebook
- `POST /api/upload/assets` - Upload fichiers divers
- `DELETE /api/upload/:subDir/:filename` - Supprimer une image

**Authentification requise**: Tous les endpoints nécessitent:
- Token JWT valide (header `Authorization: Bearer <token>`)
- Rôle admin pour créer/supprimer

**Réponse d'upload réussie**:
```json
{
  "success": true,
  "message": "Fichier uploadé avec succès",
  "data": {
    "filename": "1234567890-logo.png",
    "url": "/uploads/partners/1234567890-logo.png",
    "mimetype": "image/png",
    "size": 125430
  }
}
```

#### 4. Initialisation dans `server.js`
- Import des configurations storage
- Appel de `initStorageDirs()` au démarrage
- Serveur statique: `app.use('/uploads', express.static('uploads/'))`
- Routes montées: `app.use('/api/upload', uploadRoutes)`

### Frontend

#### 1. Composant ImageUploader (`src/components/ImageUploader.tsx`)

**Props**:
```typescript
interface ImageUploaderProps {
  label: string;              // Label du champ
  value: string;              // URL de l'image actuelle
  onChange: (url: string) => void; // Callback avec la nouvelle URL
  required?: boolean;         // Champ requis ?
  uploadEndpoint: string;     // Endpoint ('partners', 'newsletters', etc.)
}
```

**Fonctionnalités**:
- Preview de l'image (locale + serveur)
- Validation côté client (type, taille)
- Upload automatique vers le backend
- Indicateur de progression
- Messages de succès/erreur
- Suppression d'image avec overlay hover
- Support des images depuis `/uploads` ou base64

**Utilisation**:
```tsx
<ImageUploader
  label="Logo du partenaire"
  value={formData.logo_url}
  onChange={(url) => setFormData({ ...formData, logo_url: url })}
  uploadEndpoint="partners"
  required
/>
```

## Workflow d'Upload

1. **Utilisateur sélectionne un fichier**
   - Validation côté client (type, taille)
   - Preview locale créée (FileReader)

2. **Upload vers le backend**
   - FormData avec le fichier
   - Token JWT dans les headers
   - POST vers `/api/upload/{endpoint}`

3. **Traitement backend**
   - Multer reçoit le fichier
   - Validation du type et de la taille
   - Stockage dans `uploads/{subDir}/`
   - Nom de fichier unique généré

4. **Réponse au frontend**
   - URL relative retournée: `/uploads/{subDir}/{filename}`
   - Frontend met à jour l'état
   - Image affichée depuis `http://localhost:5001/uploads/...`

5. **Sauvegarde en base de données**
   - L'URL relative est sauvegardée dans le champ (ex: `logo_url`)
   - Pas de chemin absolu → système flexible

## Avantages du Système

### ✅ Flexibilité
- Les URL relatives permettent de changer facilement de domaine
- Facilite la migration vers le cloud (S3, Azure Blob, etc.)
- Pas de dépendance au chemin absolu

### ✅ Sécurité
- Validation stricte des types de fichiers
- Limitation de la taille (évite DoS)
- Authentification requise pour upload/delete
- Noms de fichiers uniques (évite écrasement)

### ✅ Organisation
- Structure claire par type d'entité
- Facile de retrouver les fichiers
- Permet des sauvegardes ciblées

### ✅ Performance
- Fichiers servis directement par Express (static)
- Pas de base64 dans la DB (économise de l'espace)
- Possibilité d'ajouter un CDN facilement

### ✅ UX
- Preview instantanée
- Feedback visuel (succès/erreur)
- Drag & drop facile à ajouter
- Indicateur de progression

## Migration Future vers le Cloud

Le système est conçu pour faciliter la migration vers un stockage cloud:

### Changements nécessaires pour S3/Azure:
1. **Backend**:
   - Remplacer `multer.diskStorage` par `multer-s3`
   - Mettre à jour `storage.js` avec les credentials cloud
   - Les routes restent identiques

2. **Frontend**:
   - Aucun changement nécessaire!
   - Les URL seront simplement des URL cloud au lieu de `/uploads`

3. **Base de données**:
   - Aucun changement nécessaire!
   - Les colonnes `logo_url`, `image_url`, etc. contiendront les URL cloud

### Exemple de migration S3:
```javascript
// Avant (local)
const storage = multer.diskStorage({
  destination: './uploads/partners',
  filename: generateFileName
});

// Après (S3)
const storage = multerS3({
  s3: s3Client,
  bucket: 'cenadi-uploads',
  key: (req, file, cb) => cb(null, `partners/${generateFileName(file.originalname)}`)
});
```

## Utilisation dans les Pages

### Exemple: Partners.tsx
```tsx
import { ImageUploader } from '../components/ImageUploader';

// Dans le formulaire
<ImageUploader
  label="Logo du partenaire"
  value={formData.logo_url}
  onChange={(url) => setFormData({ ...formData, logo_url: url })}
  uploadEndpoint="partners"
  required
/>

// À la soumission
const handleSubmit = async () => {
  // formData.logo_url contient déjà l'URL uploadée
  await api.partners.create(formData);
};
```

## Tests

### Test d'upload manuel avec curl:
```bash
# Upload
curl -X POST http://localhost:5001/api/upload/partners \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/logo.png"

# Vérifier l'image
curl http://localhost:5001/uploads/partners/1234567890-logo.png

# Supprimer
curl -X DELETE http://localhost:5001/api/upload/partners/1234567890-logo.png \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Améliorations Futures

- [ ] Compression d'images automatique
- [ ] Génération de thumbnails
- [ ] Support drag & drop
- [ ] Upload multiple
- [ ] Barre de progression détaillée
- [ ] Galerie d'images
- [ ] Crop/redimensionnement avant upload
- [ ] Support des vidéos
- [ ] Rotation d'images EXIF
- [ ] Watermark automatique

## Notes Importantes

⚠️ **Production**:
- Configurer un reverse proxy (Nginx) pour servir `/uploads`
- Activer la compression gzip
- Mettre en place un CDN
- Sauvegarder régulièrement `/uploads`
- Considérer la migration vers le cloud pour la scalabilité

⚠️ **Sécurité**:
- Ne jamais faire confiance au `mimetype` client
- Valider le contenu réel du fichier (magic bytes)
- Limiter le taux d'upload par utilisateur
- Scanner les virus (ClamAV)
- Nettoyer les fichiers orphelins régulièrement
