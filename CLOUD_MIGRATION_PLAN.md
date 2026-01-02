# Plan de Migration Cloud des Uploads d'Images

**Statut:** 📋 Optionnel / Futur  
**Version:** 1.0  
**Date:** 2 janvier 2026  
**Contexte:** Migration du système de stockage local vers le cloud pour améliorer la scalabilité et la disponibilité

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture actuelle](#architecture-actuelle)
3. [Problèmes avec le stockage local](#problèmes-avec-le-stockage-local)
4. [Options cloud disponibles](#options-cloud-disponibles)
5. [Architecture cible](#architecture-cible)
6. [Plan de migration détaillé](#plan-de-migration-détaillé)
7. [Considérations de sécurité](#considérations-de-sécurité)
8. [Estimation des coûts](#estimation-des-coûts)
9. [Stratégie de rollback](#stratégie-de-rollback)
10. [Checklist de migration](#checklist-de-migration)

---

## Vue d'ensemble

Le système CENADI stocke actuellement toutes les images d'upload en local dans le dossier `/uploads/`. Cette documentation fournit un guide complet pour migrer vers un service de stockage cloud tout en maintenant la compatibilité avec le code existant.

### Bénéfices attendus

- ✅ Scalabilité automatique sans gestion d'infrastructure
- ✅ Haute disponibilité et résilience
- ✅ Sauvegardes automatiques et versioning
- ✅ CDN intégré pour une meilleure performance
- ✅ Coûts opérationnels réduits à long terme
- ✅ Sécurité renforcée (chiffrement, contrôle d'accès)

---

## Architecture actuelle

### Structure du stockage local

```
/uploads/
├── partners/          # Logos partenaires
├── newsletters/       # Images newsletters
├── news/             # Images articles
├── projects/         # Images projets
├── staff/            # Photos équipe
├── ebooks/           # Couvertures e-books
├── assets/           # Assets divers
├── director/         # Photos directeur
└── minister/         # Photos ministre
```

### Flux actuel

```
Frontend Admin
    ↓
POST /api/upload/{endpoint}
    ↓
upload.js (Multer)
    ↓
storage.js (diskStorage)
    ↓
/uploads/{subDir}/{filename}
    ↓
GET /uploads/... (Express static)
```

### Configuration actuelle

- **Taille max:** 5MB par fichier
- **Types:** JPEG, PNG, WebP, SVG
- **Nommage:** `{timestamp}-{uuid}.{ext}`
- **Middleware:** Multer avec validation
- **Authentification:** JWT Bearer token

---

## Problèmes avec le stockage local

| Problème                             | Impact                                         | Urgence    |
| ------------------------------------ | ---------------------------------------------- | ---------- |
| **Pas de backup automatique**        | Perte de données en cas de crash serveur       | 🔴 Haute   |
| **Pas de réplication**               | Single point of failure                        | 🔴 Haute   |
| **Gestion manuelle d'espace disque** | Dégradation des performances                   | 🟡 Moyenne |
| **Pas de CDN**                       | Latence élevée pour les utilisateurs distants  | 🟡 Moyenne |
| **Sécurité limitée**                 | Pas de chiffrement au repos                    | 🟡 Moyenne |
| **Pas de versionning**               | Impossible de récupérer des versions anciennes | 🟢 Basse   |

---

## Options cloud disponibles

### 1. Azure Blob Storage (⭐ Recommandé)

**Avantages:**

- Intégration native avec écosystème Microsoft
- Coûts compétitifs
- Excellent pour multilingue (données géodistribuées)
- CDN intégré (Azure CDN)
- Support OAuth2 natif

**Inconvénients:**

- Moins populaire que S3
- Courbe d'apprentissage

**Prix estimé:** 0.018$/GB/mois (premiers 50TB)

**SDK:** `@azure/storage-blob`

### 2. Amazon S3 (⭐ Alternative solide)

**Avantages:**

- Service le plus mature et stable
- Écosystème très riche
- CloudFront CDN performant
- Large communauté

**Inconvénients:**

- Peut être plus cher à grande échelle
- Plus complexe pour la configuration

**Prix estimé:** 0.023$/GB/mois

**SDK:** `aws-sdk` / `@aws-sdk/client-s3`

### 3. Google Cloud Storage

**Avantages:**

- Excellente performance
- Intégration Cloud CDN

**Inconvénients:**

- Légèrement plus cher
- Moins pertinent pour l'Afrique centrale

**Prix estimé:** 0.020$/GB/mois

**SDK:** `@google-cloud/storage`

### 4. Bunny CDN (💰 Économique)

**Avantages:**

- Très économique
- Support natif du stockage + CDN
- Infrastructure mondiale

**Inconvénients:**

- Moins de features
- Support limité

**Prix estimé:** 0.01$/GB/mois

---

## Architecture cible

### Avec Azure Blob Storage (scénario recommandé)

```
Frontend Admin
    ↓
POST /api/upload/{endpoint}
    ↓
upload.js (Multer - validation en mémoire)
    ↓
uploadController.js (NOUVEAU)
    ↓
Azure Blob Storage SDK
    ↓
Stockage cloud + CDN
    ↓
URL CDN: https://cdn.cenadi.com/uploads/{subDir}/{filename}
```

### Composants à mettre en place

```typescript
// src/config/cloudStorage.ts - NOUVEAU
const cloudStorageConfig = {
  provider: "azure", // ou 'aws', 'gcs'
  credentials: {
    accountName: process.env.AZURE_STORAGE_ACCOUNT,
    accountKey: process.env.AZURE_STORAGE_KEY,
  },
  containerName: "cenadi-uploads",
  cdnUrl: process.env.CDN_URL, // https://cdn.cenadi.com
  fallbackLocal: true, // Fallback sur local en dev
};
```

### Base de données - Migrations requises

```sql
-- Migration: AddCloudStorageFields
ALTER TABLE partners ADD COLUMN logo_url_local VARCHAR(255);
ALTER TABLE partners ADD COLUMN logo_provider VARCHAR(50) DEFAULT 'local';
ALTER TABLE partners ADD COLUMN logo_metadata JSONB;

-- Idem pour articles, projects, ebooks, newsletters, staff
```

---

## Plan de migration détaillé

### Phase 1: Préparation (1-2 semaines)

#### 1.1 Setup infrastructure cloud

```bash
# Azure example
az login
az storage account create \
  --name cenadi \
  --resource-group cenadi-rg \
  --location westeurope \
  --sku Standard_LRS

# Créer les containers
az storage container create \
  --account-name cenadi \
  --name uploads
```

#### 1.2 Configuration des variables d'environnement

```env
# .env
CLOUD_STORAGE_ENABLED=false  # false pendant le dev, true en prod
CLOUD_STORAGE_PROVIDER=azure
AZURE_STORAGE_ACCOUNT=cenadi
AZURE_STORAGE_KEY=***
AZURE_STORAGE_CONTAINER=uploads
CDN_URL=https://cdn.cenadi.com
FALLBACK_TO_LOCAL=true
```

#### 1.3 Implémenter la abstraction de stockage

```typescript
// src/services/StorageService.ts - NOUVEAU
export interface IStorageService {
  upload(
    file: Express.Multer.File,
    subdir: string
  ): Promise<{ url: string; metadata: any }>;
  delete(filename: string, subdir: string): Promise<void>;
  exists(filename: string, subdir: string): Promise<boolean>;
  generateSignedUrl(
    filename: string,
    subdir: string,
    expiresIn?: number
  ): Promise<string>;
}

export class LocalStorageService implements IStorageService {
  // Implémentation existante
}

export class AzureStorageService implements IStorageService {
  // Nouvelle implémentation
}

export class StorageFactory {
  static createService(): IStorageService {
    if (process.env.CLOUD_STORAGE_ENABLED === "true") {
      return new AzureStorageService();
    }
    return new LocalStorageService();
  }
}
```

### Phase 2: Implémentation (2-3 semaines)

#### 2.1 Créer le service Azure Storage

```typescript
// src/services/AzureStorageService.ts
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuid } from "uuid";

export class AzureStorageService implements IStorageService {
  private blobClient: BlobServiceClient;

  constructor() {
    this.blobClient = BlobServiceClient.fromConnectionString(
      `DefaultEndpointsProtocol=https;AccountName=${process.env.AZURE_STORAGE_ACCOUNT};AccountKey=${process.env.AZURE_STORAGE_KEY};EndpointSuffix=core.windows.net`
    );
  }

  async upload(
    file: Express.Multer.File,
    subdir: string
  ): Promise<{ url: string; metadata: any }> {
    const container = this.blobClient.getContainerClient(
      process.env.AZURE_STORAGE_CONTAINER!
    );

    const filename = `${Date.now()}-${uuid()}.${file.originalname
      .split(".")
      .pop()}`;
    const blobPath = `${subdir}/${filename}`;
    const blockBlobClient = container.getBlockBlobClient(blobPath);

    await blockBlobClient.upload(file.buffer, file.size, {
      metadata: {
        originalName: file.originalname,
        mimetype: file.mimetype,
        uploadedAt: new Date().toISOString(),
      },
    });

    const cdnUrl = process.env.CDN_URL
      ? `${process.env.CDN_URL}/${blobPath}`
      : blockBlobClient.url;

    return {
      url: cdnUrl,
      metadata: {
        provider: "azure",
        container: process.env.AZURE_STORAGE_CONTAINER,
        blobPath,
        size: file.size,
      },
    };
  }

  async delete(filename: string, subdir: string): Promise<void> {
    const container = this.blobClient.getContainerClient(
      process.env.AZURE_STORAGE_CONTAINER!
    );
    const blockBlobClient = container.getBlockBlobClient(
      `${subdir}/${filename}`
    );
    await blockBlobClient.delete();
  }
}
```

#### 2.2 Mettre à jour le contrôleur d'upload

```typescript
// src/controllers/uploadController.ts
import { StorageFactory } from "../services/StorageService";

const storageService = StorageFactory.createService();

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  const { endpoint } = req.params;

  try {
    const result = await storageService.upload(req.file, endpoint);

    // Sauvegarder les métadonnées en BD si besoin
    // await File.create({ url: result.url, metadata: result.metadata });

    return res.status(200).json({
      success: true,
      data: {
        filename: req.file.originalname,
        url: result.url,
        mimetype: req.file.mimetype,
        size: req.file.size,
        metadata: result.metadata,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
};
```

### Phase 3: Migration des données (1 semaine)

#### 3.1 Créer un script de migration

```typescript
// scripts/migrateToCloud.ts
import fs from "fs-extra";
import path from "path";
import { AzureStorageService } from "../src/services/AzureStorageService";

async function migrateFiles() {
  const storageService = new AzureStorageService();
  const uploadsDir = path.join(process.cwd(), "uploads");

  const subdirs = [
    "partners",
    "newsletters",
    "news",
    "projects",
    "staff",
    "ebooks",
    "assets",
  ];

  for (const subdir of subdirs) {
    const dirPath = path.join(uploadsDir, subdir);

    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const buffer = await fs.readFile(filePath);

      console.log(`Migrating ${subdir}/${file}...`);

      // Mock Express.Multer.File
      const mockFile = {
        buffer,
        originalname: file,
        mimetype: getMimetype(file),
        size: buffer.length,
      } as any;

      try {
        await storageService.upload(mockFile, subdir);
        console.log(`✅ ${subdir}/${file} migré avec succès`);
      } catch (error) {
        console.error(`❌ Erreur pour ${subdir}/${file}:`, error);
      }
    }
  }
}

// Lancer: npx ts-node scripts/migrateToCloud.ts
migrateFiles();
```

#### 3.2 Mettre à jour les URLs en BD

```typescript
// scripts/updateUrlsInDatabase.ts
import { sequelize } from "../src/config/database";

async function updateUrls() {
  const models = [
    "Partner",
    "Article",
    "Project",
    "Newsletter",
    "Staff",
    "EBook",
  ];

  for (const model of models) {
    // Logique pour mettre à jour les URLs
    // De /uploads/... vers https://cdn.cenadi.com/uploads/...
  }
}
```

### Phase 4: Tests et validation (1 semaine)

#### 4.1 Tests d'upload

```bash
# Test upload Azure
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@test.jpg" \
  http://localhost:5001/api/upload/partners
```

#### 4.2 Tests de performance

- Mesurer les temps d'upload
- Vérifier les téléchargements CDN
- Valider la disponibilité des images

#### 4.3 Tests de sécurité

- Vérifier les permissions d'accès
- Tester les délais d'expiration des URLs
- Valider l'authentification

### Phase 5: Déploiement progressif (2 semaines)

```
Jour 1: Déployer en environnement de test
Jour 2-3: Test exhaustif avec données réelles
Jour 4-5: Déploiement en staging
Jour 6-7: Monitoring et performance
Jour 8: Déploiement production en mode parallel
Jour 9-14: Monitoring production, fallback possible
Jour 15: Désactiver le fallback local
```

---

## Considérations de sécurité

### 1. Authentification et Autorisation

```typescript
// Middleware pour vérifier les droits d'upload
const validateUploadPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { endpoint } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  // Seuls les admins peuvent uploader
  if (userRole !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  next();
};
```

### 2. Chiffrement en transit et au repos

**Azure:**

```env
# Enable encryption at rest (default)
AZURE_STORAGE_ENCRYPTION=true

# Enable HTTPS (default)
AZURE_STORAGE_HTTPS=true
```

### 3. Signature des URLs (pour partage sécurisé)

```typescript
async generateSignedUrl(filename: string, subdir: string, expiresIn = 3600) {
  const container = this.blobClient.getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER!
  );

  const blockBlobClient = container.getBlockBlobClient(`${subdir}/${filename}`);

  return blockBlobClient.generateSasUrl({
    expiresOn: new Date(Date.now() + expiresIn * 1000),
    permissions: BlobSASPermissions.parse('r'), // Read-only
  });
}
```

### 4. Validation des fichiers

```typescript
// Maintenir la validation stricte
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function validateFile(file: Express.Multer.File): boolean {
  return ALLOWED_TYPES.includes(file.mimetype) && file.size <= MAX_SIZE;
}
```

### 5. Logging et monitoring

```typescript
// Tracer tous les uploads
const logUpload = async (
  userId: string,
  filename: string,
  subdir: string,
  success: boolean
) => {
  await AuditLog.create({
    action: "FILE_UPLOAD",
    userId,
    resource: filename,
    category: subdir,
    success,
    timestamp: new Date(),
  });
};
```

---

## Estimation des coûts

### Scénario: 100 utilisateurs, 50GB stockage, 1M de requêtes/mois

| Composant                | Coût mensuel     | Coût annuel      |
| ------------------------ | ---------------- | ---------------- |
| **Azure Blob Storage**   | $0.90 (50GB)     | $10.80           |
| **Azure CDN**            | $5-15            | $60-180          |
| **Transfert de données** | $5-20            | $60-240          |
| **Transactions**         | $0.005           | $0.06            |
| **TOTAL**                | **~$12-36/mois** | **~$130-430/an** |

**Comparaison:**

- Serveur dédié: $20-50/mois → $240-600/an
- Cloud Scale: à partir de 5TB/mois, le cloud devient plus économique

---

## Stratégie de rollback

### Si la migration échoue

```bash
# 1. Garder l'accès au stockage local
FALLBACK_TO_LOCAL=true

# 2. Les uploads récents continuent depuis le cloud
# Les anciens sont servis depuis le local

# 3. Mettre en place un proxy smart
function serveImage(filename, subdir) {
  if (CLOUD_STORAGE_ENABLED) {
    try {
      return serveFromCloud(filename, subdir);
    } catch {
      return serveFromLocal(filename, subdir);
    }
  }
  return serveFromLocal(filename, subdir);
}
```

### Points de rollback

**Jours 1-7 après déploiement:**

- Copie complète du local en cloud
- Stockage local accessible
- Peut basculer rapidement

**Jour 8-14:**

- Valider l'intégrité des données
- Supprimer progressivement le local
- Point de non-retour après validation complète

---

## Checklist de migration

### Avant la migration

- [ ] Audit de tous les fichiers stockés localement
- [ ] Sauvegarde complète du dossier `/uploads/`
- [ ] Dimensionnement du stockage cloud
- [ ] Configuration des identifiants cloud
- [ ] Plan de test détaillé
- [ ] Fenêtre de maintenance planifiée

### Pendant la migration

- [ ] Implémenter la couche d'abstraction
- [ ] Tests unitaires de `StorageService`
- [ ] Tests d'intégration avec le cloud
- [ ] Tester le fallback local
- [ ] Migrer les fichiers existants
- [ ] Mettre à jour les URLs en BD
- [ ] Déployer en staging
- [ ] Tests de charge

### Après la migration

- [ ] Valider les accès aux images
- [ ] Vérifier les performances CDN
- [ ] Monitoring des coûts
- [ ] Monitoring des erreurs
- [ ] Nettoyer le stockage local
- [ ] Documenter les changements
- [ ] Former l'équipe DevOps

---

## Commandes de déploiement

```bash
# Installation des dépendances
npm install @azure/storage-blob

# Configuration
cp .env.example .env
# Remplir AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_KEY, CDN_URL

# Migration des données
npx ts-node scripts/migrateToCloud.ts

# Mise à jour des URLs en BD
npx ts-node scripts/updateUrlsInDatabase.ts

# Tests
npm run test:storage

# Déploiement
CLOUD_STORAGE_ENABLED=true npm run build
npm run start
```

---

## Contact et support

**Pour toute question sur cette migration:**

- Documenter les problèmes dans les issues GitHub
- Contacter l'équipe DevOps
- Consulter la documentation Azure: https://learn.microsoft.com/fr-fr/azure/storage/blobs/

**Timeline recommandée:**

- Q2 2026: Implémentation
- Q3 2026: Tests en staging
- Q4 2026: Déploiement production

---

**Statut:** 📋 À réviser avant implémentation  
**Dernière mise à jour:** 2 janvier 2026
