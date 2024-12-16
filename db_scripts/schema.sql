CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(2083) NOT NULL,
    cookie JSON NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_in_days INT NOT NULL, -- Subscription duration in days
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

-- Fetch current subscriptions for a specific user.
SELECT 
    o.id AS order_id,
    p.name AS product_name,
    pl.name AS plan_name,
    pl.price,
    o.start_date,
    o.end_date
FROM orders o
JOIN plans pl ON o.plan_id = pl.id
JOIN products p ON pl.product_id = p.id
WHERE o.user_id = ? AND o.status = 'active' AND o.end_date >= CURDATE();

-- admin
SELECT 
    o.id AS order_id,
    u.name AS user_name,
    p.name AS product_name,
    pl.name AS plan_name,
    pl.price,
    o.start_date,
    o.end_date,
    o.status
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN plans pl ON o.plan_id = pl.id
JOIN products p ON pl.product_id = p.id;

-- Add this table definition to your schema.sql file
CREATE TABLE IF NOT EXISTS Packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    priceInBdt DECIMAL(10,2) NOT NULL,
    priceInUsd DECIMAL(10,2) NOT NULL,
    productID INT NOT NULL,
    durationType VARCHAR(50) NOT NULL,
    durationValue INT NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    imageId VARCHAR(255),
    imageUrl TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (productID) REFERENCES Products(id)
);
