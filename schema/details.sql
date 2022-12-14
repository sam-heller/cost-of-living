DROP TABLE IF EXISTS Price;
CREATE TABLE Price (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `city_id` INTEGER NOT NULL,
    `category` TEXT NOT NULL, 
    `name` TEXT NOT NULL, 
    `average_price` INTEGER DEFAULT 'US',
    `upper_pricerange` INTEGER,
    `lower_pricerange` INTEGER,
    UNIQUE (`city_id`, `name`)
    FOREIGN KEY (`city_id`) REFERENCES City(`id`)
);