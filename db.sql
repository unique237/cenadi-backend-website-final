CREATE TABLE users
(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'author')) DEFAULT 'author',
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'active', 'suspended')) DEFAULT 'pending',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories
(
    category_id SERIAL PRIMARY KEY,
    name_en VARCHAR(50) NOT NULL,
    name_fr VARCHAR(50) NOT NULL
);
CREATE TABLE articles
(
    article_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id),
    author_id INT REFERENCES users(user_id),

    title_en VARCHAR(255) NOT NULL,
    title_fr VARCHAR(255) NOT NULL,

    slug_en VARCHAR(255) UNIQUE NOT NULL,
    slug_fr VARCHAR(255) UNIQUE NOT NULL,

    excerpt_en TEXT NOT NULL,
    excerpt_fr TEXT NOT NULL,

    content_en TEXT NOT NULL,
    content_fr TEXT NOT NULL,

    image_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE projects
(
    project_id SERIAL PRIMARY KEY,

    title_en VARCHAR(150) NOT NULL,
    title_fr VARCHAR(150) NOT NULL,

    description_en TEXT NOT NULL,
    description_fr TEXT NOT NULL,

    link VARCHAR(255) NOT NULL DEFAULT 'https://cenadi.cm/en/contact/',
    posted_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE director_messages
(
    message_id SERIAL PRIMARY KEY,

    director_name VARCHAR(100) NOT NULL,

    title_en VARCHAR(255) NOT NULL,
    title_fr VARCHAR(255) NOT NULL,

    excerpt_en TEXT NOT NULL,
    excerpt_fr TEXT NOT NULL,

    content_en TEXT NOT NULL,
    content_fr TEXT NOT NULL,

    image_url VARCHAR(255),

    x VARCHAR(255),
    linkedin VARCHAR(255),
    email VARCHAR(100)
);

CREATE TABLE staffs
(
    staff_id SERIAL PRIMARY KEY,

    staff_name_en VARCHAR(100) NOT NULL,
    staff_name_fr VARCHAR(100) NOT NULL,


    title_en VARCHAR(100) NOT NULL,
    title_fr VARCHAR(100) NOT NULL,

    description_en TEXT NOT NULL,
    description_fr TEXT NOT NULL,

    rank_en VARCHAR(100) NOT NULL,
    rank_fr VARCHAR(100) NOT NULL,

    department_en VARCHAR(100) NOT NULL,
    department_fr VARCHAR(100) NOT NULL,

    image_url TEXT NOT NULL,
    email VARCHAR(100),
    linkedin VARCHAR(255),
    x VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE facts
(
    fact_id SERIAL PRIMARY KEY,
    content_en TEXT NOT NULL,
    content_fr TEXT NOT NULL,
    posted_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE finance_minister_messages
(
    message_id SERIAL PRIMARY KEY,

    minister_name VARCHAR(100) NOT NULL,

    content_en TEXT NOT NULL,
    content_fr TEXT NOT NULL,

    image_url VARCHAR(255),

    telephone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255)
);

CREATE TABLE assets
(
    asset_id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100) NOT NULL,
    description_en TEXT NOT NULL,
    description_fr TEXT NOT NULL,
    image_url TEXT NOT NULL

);

CREATE TABLE ebooks
(
    book_id SERIAL PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_fr VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_fr TEXT NOT NULL,
    link VARCHAR(255),
    posted_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE partners
(
    partner_id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100) NOT NULL,
    description_en TEXT NOT NULL,
    description_fr TEXT NOT NULL,

    logo_url VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE INDEX idx_articles_slug_en ON articles(slug_en);
CREATE INDEX idx_articles_slug_fr ON articles(slug_fr);
