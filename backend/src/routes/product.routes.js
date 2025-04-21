const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/roles.middleware');
const {
  validateProduct,
  validateId
} = require('../middleware/validation.middleware');
const {
  upload,
  handleUploadError,
  deleteOldFile
} = require('../middleware/upload.middleware');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', validateId, getProductById);

// Protected routes (Admin only)
router.post('/', 
  verifyToken, 
  isAdmin, 
  upload.single('image'), 
  handleUploadError,
  validateProduct, 
  createProduct
);

router.put('/:id', 
  verifyToken, 
  isAdmin, 
  validateId, 
  upload.single('image'),
  handleUploadError,
  deleteOldFile,
  validateProduct, 
  updateProduct
);

router.delete('/:id', 
  verifyToken, 
  isAdmin, 
  validateId, 
  deleteOldFile,
  deleteProduct
);

module.exports = router;
