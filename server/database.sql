CREATE DATABASE chinese_evs;

CREATE TABLE cars (
    model_id SERIAL PRIMARY KEY,
    model_name VARCHAR(255),
    price INTEGER,
    year INTEGER,
    power INTEGER,
    battery INTEGER,
    image_url TEXT,
    last_edited_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- The ALTER TABLE for image_url might already have been run.
-- If the table exists and you are adding last_edited_at to an existing table:
-- ALTER TABLE cars ADD COLUMN last_edited_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE auth_users (
    user_id SERIAL PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Store hashed passwords, not plain text!
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Example for inserting a manually hashed password (do this in your DB client or a script):
-- For bcrypt, the password hashing is typically done in the application code before inserting.
-- If you are adding users manually to the DB, you would insert the *hashed* password.
-- e.g., INSERT INTO auth_users (login, password) VALUES ('admin', 'hashed_password_string_here');
