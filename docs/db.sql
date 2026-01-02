-- =====================================================
-- Schéma PostgreSQL pour Cenadi Backend
-- =====================================================

-- Créer la base de données (si nécessaire)
-- CREATE DATABASE cenadi_db;

-- =====================================================
-- TABLE: users
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'author' CHECK (role IN ('admin', 'author')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'active',
            'suspended'
        )
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: categories
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: articles
-- =====================================================
CREATE TABLE IF NOT EXISTS articles (
    article_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories (category_id) ON DELETE SET NULL,
    author_id INTEGER REFERENCES users (user_id) ON DELETE SET NULL,
    title_en VARCHAR(255) NOT NULL,
    title_fr VARCHAR(255) NOT NULL,
    slug_en VARCHAR(255) UNIQUE,
    slug_fr VARCHAR(255) UNIQUE,
    excerpt_en TEXT NOT NULL,
    excerpt_fr TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_fr TEXT NOT NULL,
    image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: projects
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_fr VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_fr TEXT NOT NULL,
    link VARCHAR(500) DEFAULT 'https://cenadi.cm/en/contact/',
    image_url VARCHAR(500),
    posted_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: director_messages
-- =====================================================
CREATE TABLE IF NOT EXISTS director_messages (
    message_id SERIAL PRIMARY KEY,
    director_name VARCHAR(255),
    title_en VARCHAR(255),
    title_fr VARCHAR(255),
    excerpt_en TEXT,
    excerpt_fr TEXT,
    content_en TEXT NOT NULL,
    content_fr TEXT NOT NULL,
    image_url VARCHAR(500),
    x VARCHAR(255),
    linkedin VARCHAR(255),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: staffs
-- =====================================================
CREATE TABLE IF NOT EXISTS staffs (
    staff_id SERIAL PRIMARY KEY,
    staff_name_en VARCHAR(255) NOT NULL,
    staff_name_fr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_fr VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_fr TEXT NOT NULL,
    rank_en VARCHAR(100) NOT NULL,
    rank_fr VARCHAR(100) NOT NULL,
    department_en VARCHAR(255) NOT NULL,
    department_fr VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    email VARCHAR(255),
    linkedin VARCHAR(255),
    x VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: facts
-- =====================================================
CREATE TABLE IF NOT EXISTS facts (
    fact_id SERIAL PRIMARY KEY,
    content_en TEXT NOT NULL,
    content_fr TEXT NOT NULL,
    posted_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: finance_minister_messages
-- =====================================================
CREATE TABLE IF NOT EXISTS finance_minister_messages (
    message_id SERIAL PRIMARY KEY,
    minister_name VARCHAR(255),
    content_en TEXT NOT NULL,
    content_fr TEXT NOT NULL,
    image_url VARCHAR(500),
    telephone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: assets
-- =====================================================
CREATE TABLE IF NOT EXISTS assets (
    asset_id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_fr TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: ebooks
-- =====================================================
CREATE TABLE IF NOT EXISTS ebooks (
    book_id SERIAL PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_fr VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_fr TEXT NOT NULL,
    link VARCHAR(500),
    posted_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: partners
-- =====================================================
CREATE TABLE IF NOT EXISTS partners (
    partner_id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_fr TEXT NOT NULL,
    logo_url VARCHAR(500) NOT NULL,
    website VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: subscribers (pour la newsletter)
-- =====================================================
CREATE TABLE IF NOT EXISTS subscribers (
    subscriber_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (
        status IN (
            'active',
            'inactive',
            'unsubscribed'
        )
    ),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES pour optimiser les requêtes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category_id);

CREATE INDEX IF NOT EXISTS idx_articles_author ON articles (author_id);

CREATE INDEX IF NOT EXISTS idx_articles_slug_en ON articles (slug_en);

CREATE INDEX IF NOT EXISTS idx_articles_slug_fr ON articles (slug_fr);

CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles (is_featured);

CREATE INDEX IF NOT EXISTS idx_articles_published ON articles (published_at);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

CREATE INDEX IF NOT EXISTS idx_users_status ON users (status);

CREATE INDEX IF NOT EXISTS idx_staffs_department_en ON staffs (department_en);

CREATE INDEX IF NOT EXISTS idx_staffs_department_fr ON staffs (department_fr);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);

CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers (status);

-- =====================================================
-- DONNÉES DE TEST (optionnel)
-- =====================================================

-- Insérer un utilisateur administrateur de test
-- Mot de passe: SecureAdmin123 (généré avec bcryptjs)
INSERT INTO
    users (
        username,
        email,
        name,
        password_hash,
        role,
        status
    )
VALUES (
        'admin',
        'admin@cenadi.cm',
        'Administrateur CENADI',
        '$2a$10$8g9bfV0PqhFrN1J0c1K2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C',
        'admin',
        'active'
    )
ON CONFLICT (username) DO NOTHING;

-- Insérer quelques catégories de test
INSERT INTO
    categories (name_en, name_fr)
VALUES ('News', 'Actualités'),
    ('Events', 'Événements'),
    (
        'Publications',
        'Publications'
    ),
    ('Announcements', 'Annonces')
ON CONFLICT DO NOTHING;