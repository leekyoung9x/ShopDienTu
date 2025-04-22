const { Product } = require('../models');
const { ValidationError, NotFoundError } = require('../utils/errors.utils');
const { Op } = require('sequelize');

const getAllProducts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sort = '-createdAt',
      brands = '',
      category = '',
      minPrice = '',
      maxPrice = ''
    } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    // Xử lý tìm kiếm theo tên
    if (search) {
      where.name = {
        [Op.like]: `%${search}%`
      };
    }
    
    // Xử lý lọc theo thương hiệu
    if (brands && brands.length > 0) {
      const brandArray = brands.split(',');
      if (brandArray.length > 0) {
        where.brand = {
          [Op.in]: brandArray
        };
      }
    }
    
    // Xử lý lọc theo danh mục
    if (category) {
      where.category = category;
    }
    
    // Xử lý lọc theo khoảng giá
    if (minPrice && !isNaN(parseFloat(minPrice))) {
      where.price = where.price || {};
      where.price[Op.gte] = parseFloat(minPrice);
    }
    
    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      where.price = where.price || {};
      where.price[Op.lte] = parseFloat(maxPrice);
    }

    // Xử lý tham số sắp xếp
    let order = [['createdAt', 'DESC']];  // Mặc định
    
    if (sort) {
      const isDesc = sort.startsWith('-');
      const field = isDesc ? sort.substring(1) : sort;
      const direction = isDesc ? 'DESC' : 'ASC';
      
      // Đảm bảo field hợp lệ để tránh SQL injection
      const validFields = ['name', 'price', 'createdAt', 'quantity', 'brand', 'category'];
      if (validFields.includes(field)) {
        order = [[field, direction]];
      }
    }

    const products = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order
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
