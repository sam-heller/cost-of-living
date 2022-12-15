DROP TABLE IF EXISTS City;
CREATE TABLE City (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `numbeo_id` INTEGER NOT NULL DEFAULT 0,
    `name` TEXT NOT NULL, 
    `region` TEXT NOT NULL, 
    `country` TEXT NOT NULL DEFAULT 'US',
    `lat` INTEGER NOT NULL DEFAULT 0,
    `lon` INTEGER NOT NULL DEFAULT 0,
    UNIQUE(`name`,`region`,`country`)
);

DROP TABLE IF EXISTS Price;
CREATE TABLE Price (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `city_id` INTEGER NOT NULL,
    `category` TEXT NOT NULL, 
    `name` TEXT NOT NULL, 
    `average_price` INTEGER,
    `upper_pricerange` INTEGER,
    `lower_pricerange` INTEGER,
    UNIQUE (`city_id`, `name`)
);