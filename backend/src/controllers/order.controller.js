const { Order, OrderItem, Product, User } = require('../models');
const { ValidationError, NotFoundError } = require('../utils/errors.utils');
const { sequelize } = require('../config/database');

const checkout = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Items are required');
    }

    // Calculate total and validate items
    let totalAmount = 0;
    const itemsToCreate = [];
    const productUpdates = [];

    // Fetch all products at once
    const productIds = items.map(item => item.productId);
    const products = await Product.findAll({
      where: { id: productIds }
    });

    // Create a map for easier lookup
    const productMap = products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});

    // Validate items and prepare data
    for (const item of items) {
      const product = productMap[item.productId];
      if (!product) {
        throw new NotFoundError(`Product with id ${item.productId} not found`);
      }

      if (product.quantity < item.quantity) {
        throw new ValidationError(`Insufficient stock for product: ${product.name}`);
      }

      totalAmount += product.price * item.quantity;
      
      itemsToCreate.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });

      productUpdates.push({
        id: product.id,
        quantity: product.quantity - item.quantity
      });
    }

    // Create order
    const order = await Order.create({
      userId,
      totalAmount,
      status: 'pending'
    }, { transaction: t });

    // Create order items
    await OrderItem.bulkCreate(
      itemsToCreate.map(item => ({
        ...item,
        orderId: order.id
      })),
      { transaction: t }
    );

    // Update product quantities
    await Promise.all(
      productUpdates.map(update =>
        Product.update(
          { quantity: update.quantity },
          { 
            where: { id: update.id },
            transaction: t
          }
        )
      )
    );

    await t.commit();

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image']
        }]
      }]
    });

    res.status(201).json({
      message: 'Order created successfully',
      data: completeOrder
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const orders = await Order.findAndCountAll({
      where: { userId },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image']
        }]
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'Orders retrieved successfully',
      data: orders.rows,
      total: orders.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(orders.count / limit)
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { 
        id,
        userId
      },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image', 'price']
        }]
      }]
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    res.json({
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkout,
  getUserOrders,
  getOrderById
};
