CREATE DATABASE chinese_evs;

CREATE TABLE cars (
    model_id SERIAL PRIMARY KEY,
    model_name VARCHAR(255),
    price INTEGER,
    year INTEGER,
    power INTEGER,
    battery INTEGER,
    image_url TEXT
);
