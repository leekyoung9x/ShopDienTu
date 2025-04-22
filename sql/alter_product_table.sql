-- Alter Product table to add brand and category columns
ALTER TABLE Products
ADD COLUMN brand VARCHAR(255) DEFAULT NULL,
ADD COLUMN category VARCHAR(255) DEFAULT NULL;

-- Update existing products with sample brand and category data
-- You can customize these values based on your existing product data
UPDATE Products SET brand = 'Apple', category = 'Phone' WHERE name LIKE '%iPhone%';
UPDATE Products SET brand = 'Apple', category = 'Tablet' WHERE name LIKE '%iPad%';
UPDATE Products SET brand = 'Apple', category = 'Laptop' WHERE name LIKE '%MacBook%';
UPDATE Products SET brand = 'Samsung', category = 'Phone' WHERE name LIKE '%Samsung%' OR name LIKE '%Galaxy%';
UPDATE Products SET brand = 'Sony', category = 'Headphones' WHERE name LIKE '%Sony%' OR name LIKE '%headphone%';
UPDATE Products SET brand = 'Dell', category = 'Laptop' WHERE name LIKE '%Dell%' OR name LIKE '%XPS%';
UPDATE Products SET brand = 'Asus', category = 'Laptop' WHERE name LIKE '%Asus%';

-- Set default values for remaining products
UPDATE Products SET brand = 'Other' WHERE brand IS NULL;
UPDATE Products SET category = 'Accessories' WHERE category IS NULL;

-- Create index for faster searching and filtering
CREATE INDEX idx_product_brand ON Products(brand);
CREATE INDEX idx_product_category ON Products(category);
