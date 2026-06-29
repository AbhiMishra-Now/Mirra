-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    tier VARCHAR(50) DEFAULT 'FREE' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    affiliate_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create try_on_sessions table
CREATE TABLE IF NOT EXISTS try_on_sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255),
    dock_type VARCHAR(50) NOT NULL,
    video_src TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for performance optimization (DSQL requires ASYNC indexes)
CREATE INDEX ASYNC IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX ASYNC IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX ASYNC IF NOT EXISTS idx_sessions_user_id ON try_on_sessions(user_id);
