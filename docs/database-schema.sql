-- =====================================================
-- Schéma PostgreSQL pour Cenadi Admin Dashboard
-- =====================================================

-- Créer la base de données (si nécessaire)
-- CREATE DATABASE cenadi;

-- =====================================================
-- TABLE: users
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
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
    excerpt_en TEXT,
    excerpt_fr TEXT,
    content_en TEXT,
    content_fr TEXT,
    image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
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
    description_en TEXT,
    description_fr TEXT,
    link VARCHAR(500),
    image_url VARCHAR(500),
    posted_on TIMESTAMP,
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
    content_en TEXT,
    content_fr TEXT,
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
    staff_name_en VARCHAR(255),
    staff_name_fr VARCHAR(255),
    title_en VARCHAR(255),
    title_fr VARCHAR(255),
    description_en TEXT,
    description_fr TEXT,
    rank_en VARCHAR(100),
    rank_fr VARCHAR(100),
    department_en VARCHAR(255),
    department_fr VARCHAR(255),
    image_url VARCHAR(500),
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
    posted_on TIMESTAMP,
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
    name_en VARCHAR(255),
    name_fr VARCHAR(255),
    description_en TEXT,
    description_fr TEXT,
    image_url VARCHAR(500),
    file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: ebooks
-- =====================================================
CREATE TABLE IF NOT EXISTS ebooks (
    book_id SERIAL PRIMARY KEY,
    image_url VARCHAR(500),
    title_en VARCHAR(255),
    title_fr VARCHAR(255),
    description_en TEXT,
    description_fr TEXT,
    link VARCHAR(500),
    posted_on TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: partners (optional - not in original schema)
-- =====================================================
CREATE TABLE IF NOT EXISTS partners (
    partner_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: newsletters (optional - not in original schema)
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletters (
    newsletter_id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_fr VARCHAR(255),
    content_en TEXT,
    content_fr TEXT,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- =====================================================
-- DONNÉES DE TEST (optionnel)
-- =====================================================

-- Insérer un utilisateur administrateur de test
-- Mot de passe: admin123 (à hacher avec bcryptjs)
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
        'admin@cenadi.org',
        'Administrateur',
        '$2a$10$YIuIhCWuIGsVYfYVaXHJ..0qsY5w5I5E1F3eE3E3E3E3E3E3E3E3E',
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
    )
ON CONFLICT DO NOTHING;

-- =====================================================
-- Fin du schéma
-- =====================================================