-- database: c:\workspace\yh-frontendutveckling\projekt\freaky_fashion-2\db\freaky-fashion.db

CREATE TABLE products(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productName TEXT NOT NULL,
    description TEXT NOT NULL,
    brand TEXT NOT NULL,
    img BLOB NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    price REAL NOT NULL,
    date TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE 
);

DROP TABLE products;
