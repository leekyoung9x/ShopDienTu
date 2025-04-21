const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { isUser } = require('../middleware/roles.middleware');
const {
  validateOrder,
  validateId
} = require('../middleware/validation.middleware');
const {
  checkout,
  getUserOrders,
  getOrderById
} = require('../controllers/order.controller');

// All routes require authentication
router.use(verifyToken);
router.use(isUser);

// Order routes
router.post('/checkout', validateOrder, checkout);
router.get('/', getUserOrders);
router.get('/:id', validateId, getOrderById);

module.exports = router;
