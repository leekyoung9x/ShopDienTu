const User = require('./user.model');
const Product = require('./product.model');
const Order = require('./order.model');
const OrderItem = require('./orderItem.model');
const RefreshToken = require('./refreshToken.model');

// User - Order relationship
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Order - OrderItem relationship
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items'
});
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// Product - OrderItem relationship
Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems'
});
OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// User - RefreshToken relationship
User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens'
});
RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  User,
  Product,
  Order,
  OrderItem,
  RefreshToken
};
