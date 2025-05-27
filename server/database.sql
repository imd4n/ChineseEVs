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
