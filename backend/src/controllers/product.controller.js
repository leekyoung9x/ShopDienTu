const { Product } = require('../models');
const { ValidationError, NotFoundError } = require('../utils/errors.utils');
const { Op } = require('sequelize');

const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.name = {
        [Op.like]: `%${search}%`
      };
    }

    const products = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'Products retrieved successfully',
      data: products.rows,
      total: products.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(products.count / limit)
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.json({
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price, quantity, description } = req.body;
    let image = null;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    if (!name || !price) {
      throw new ValidationError('Name and price are required');
    }

    const product = await Product.create({
      name,
      price,
      quantity: quantity || 0,
      description,
      image
    });

    res.status(201).json({
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, description } = req.body;
    let image = undefined;

    const product = await Product.findByPk(id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    await product.update({
      name: name || product.name,
      price: price || product.price,
      quantity: quantity !== undefined ? quantity : product.quantity,
      description: description || product.description,
      ...(image && { image })
    });

    res.json({
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    await product.destroy();

    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
