# E-Commerce Website Memory Bank

## Cấu trúc dự án
```
ecommerce/
├── backend/         # NodeJS Backend
├── frontend/        # Vue3 Frontend  
├── sql/            # SQL scripts
└── memorybank.md   # Project documentation
```

## Database Schema

### Users
- id (PK): int, auto increment
- email: varchar(255), unique
- password: varchar(255)
- fullName: varchar(255)
- role: enum('admin', 'user')
- createdAt: datetime
- updatedAt: datetime

### Products
- id (PK): int, auto increment
- name: varchar(255)
- price: decimal(10,2)
- quantity: int
- description: text
- image: varchar(255)
- createdAt: datetime
- updatedAt: datetime

### Orders
- id (PK): int, auto increment
- userId (FK): int
- totalAmount: decimal(10,2)
- status: enum('pending', 'completed', 'cancelled')
- createdAt: datetime
- updatedAt: datetime

### OrderItems
- id (PK): int, auto increment
- orderId (FK): int
- productId (FK): int
- quantity: int
- price: decimal(10,2)
- createdAt: datetime

### RefreshTokens
- id (PK): int, auto increment
- userId (FK): int
- token: varchar(500)
- expiresAt: datetime

## API Endpoints

### Authentication
- POST /auth/register - Đăng ký tài khoản mới
- POST /auth/login - Đăng nhập
- POST /auth/logout - Đăng xuất
- POST /auth/refresh-token - Làm mới token
- GET /auth/google - OAuth với Google

### Products
- GET /products - Lấy danh sách sản phẩm
- GET /products/:id - Lấy chi tiết sản phẩm
- POST /products - Tạo sản phẩm mới (Admin)
- PUT /products/:id - Cập nhật sản phẩm (Admin)
- DELETE /products/:id - Xóa sản phẩm (Admin)

### Orders
- POST /orders/checkout - Tạo đơn hàng mới
- GET /orders - Lấy danh sách đơn hàng của user
- GET /orders/:id - Lấy chi tiết đơn hàng

## Frontend Pages

### Public Pages
- Home (/)
- Products (/products)
- Product Detail (/products/:id)
- Login (/login)
- Register (/register)

### Protected Pages
- Cart (/cart)
- Checkout (/checkout)
- Orders (/orders)
- Order Detail (/orders/:id)
- Admin Dashboard (/admin) - Chỉ cho admin

## Công nghệ sử dụng

### Backend
- Node.js & Express
- MySQL với Sequelize ORM
- JWT cho authentication
- Passport.js cho OAuth
- Bcrypt cho mã hóa password
- Cors cho cross-origin requests

### Frontend
- Vue 3 với Vite
- PrimeVue (SakaiVue theme)
- Tailwind CSS
- Pinia cho state management
- Vue Router cho routing
- Axios cho API calls
