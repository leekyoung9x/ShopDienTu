const { ValidationError } = require('../utils/errors.utils');

const validateRegister = (req, res, next) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    throw new ValidationError('Email, password và tên đầy đủ là bắt buộc');
  }

  if (password.length < 6) {
    throw new ValidationError('Mật khẩu phải có ít nhất 6 ký tự');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError('Email không hợp lệ');
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email và mật khẩu là bắt buộc');
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name, price, quantity } = req.body;

  if (!name || !price) {
    throw new ValidationError('Tên và giá sản phẩm là bắt buộc');
  }

  if (isNaN(price) || price <= 0) {
    throw new ValidationError('Giá sản phẩm phải là số dương');
  }

  if (quantity !== undefined && (isNaN(quantity) || quantity < 0)) {
    throw new ValidationError('Số lượng sản phẩm phải là số không âm');
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ValidationError('Đơn hàng phải có ít nhất một sản phẩm');
  }

  items.forEach((item, index) => {
    if (!item.productId || !item.quantity) {
      throw new ValidationError(`Sản phẩm thứ ${index + 1} thiếu thông tin cần thiết`);
    }

    if (isNaN(item.quantity) || item.quantity <= 0) {
      throw new ValidationError(`Số lượng của sản phẩm thứ ${index + 1} phải là số dương`);
    }
  });

  next();
};

const validateRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ValidationError('Refresh token là bắt buộc');
  }

  next();
};

const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    throw new ValidationError('ID không hợp lệ');
  }

  next();
};

const validateProfile = (req, res, next) => {
  const { fullName, phone, address } = req.body;

  if (!fullName) {
    throw new ValidationError('Họ và tên là bắt buộc');
  }

  if (phone && !/^[0-9]{10,11}$/.test(phone)) {
    throw new ValidationError('Số điện thoại không hợp lệ');
  }

  next();
};

const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError('Mật khẩu hiện tại và mật khẩu mới là bắt buộc');
  }

  if (newPassword.length < 6) {
    throw new ValidationError('Mật khẩu mới phải có ít nhất 6 ký tự');
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  validateRefreshToken,
  validateId,
  validateProfile,
  validateChangePassword
};
