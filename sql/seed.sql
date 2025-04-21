USE ecommerce_db;

-- Insert admin user (password: admin123)
INSERT INTO users (email, password, fullName, role) VALUES
('admin@example.com', '$2b$10$aQFhq.Tqqz1mI1OD4uBZ6.G5DvQJ9VrN0nGfdsFEaS/Goex0oVmLG', 'Admin User', 'admin');

-- Insert regular users (password: user123)
INSERT INTO users (email, password, fullName, role) VALUES
('user1@example.com', '$2b$10$n7LGX1J3HkR7mm8T2wFBxuCjsRvyJZrUGUPA4tn/zRYlFghIHxKVO', 'User One', 'user'),
('user2@example.com', '$2b$10$n7LGX1J3HkR7mm8T2wFBxuCjsRvyJZrUGUPA4tn/zRYlFghIHxKVO', 'User Two', 'user');

-- Insert sample products
INSERT INTO products (name, price, quantity, description, image) VALUES
('iPhone 14 Pro', 999.99, 50, 'Mới nhất từ Apple với camera 48MP và chip A16 Bionic', '/images/iphone-14-pro.jpg'),
('Samsung Galaxy S23', 899.99, 45, 'Flagship Android với Snapdragon 8 Gen 2', '/images/samsung-s23.jpg'),
('MacBook Pro M2', 1299.99, 30, 'Laptop mạnh mẽ với chip Apple Silicon M2', '/images/macbook-pro.jpg'),
('iPad Air', 599.99, 60, 'Máy tính bảng hoàn hảo cho công việc và giải trí', '/images/ipad-air.jpg'),
('AirPods Pro', 249.99, 100, 'Tai nghe không dây với chống ồn chủ động', '/images/airpods-pro.jpg'),
('Apple Watch Series 8', 399.99, 40, 'Đồng hồ thông minh với tính năng theo dõi sức khỏe', '/images/apple-watch.jpg'),
('Dell XPS 13', 1199.99, 25, 'Laptop Windows cao cấp với màn hình InfinityEdge', '/images/dell-xps.jpg'),
('Sony WH-1000XM4', 349.99, 55, 'Tai nghe chống ồn tốt nhất trên thị trường', '/images/sony-headphones.jpg'),
('Kindle Paperwhite', 139.99, 70, 'Máy đọc sách với màn hình không phản chiếu', '/images/kindle.jpg'),
('Nintendo Switch OLED', 349.99, 35, 'Máy chơi game cầm tay với màn hình OLED', '/images/switch.jpg');

-- Insert sample orders for user1
INSERT INTO orders (userId, totalAmount, status) VALUES
(2, 1249.98, 'completed');

-- Insert order items for the above order
INSERT INTO orderItems (orderId, productId, quantity, price) VALUES
(1, 1, 1, 999.99),
(1, 5, 1, 249.99);

-- Insert another order for user1
INSERT INTO orders (userId, totalAmount, status) VALUES
(2, 599.99, 'pending');

-- Insert order items for the second order
INSERT INTO orderItems (orderId, productId, quantity, price) VALUES
(2, 4, 1, 599.99);
