CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
