const ObjectId = require('mongoose').Types.ObjectId;
const { InternalError } = require('../middlewares/errorhandler');
const Address = require('../models/Address');
const Order = require('../models/Order');
const User = require('../models/User');
const Responser = require('../utils/responser');

// user profile
const getUserInfo = async (req, res, next) => {
  try {
    let userId = req.userId;
    let user = await User.findById(userId).select('fullname phone email');
    let userOrders = await Order.find({ userId });
    let userAddresses = await Address.find({ userId });
    let responser = new Responser(200, 'user info fetched', { user, userOrders, userAddresses });
    return responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

// user settings

const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      let responser = new Responser(
        401,
        'Authentication failed: Invalid token',
        null,
        'authentication_error'
      );
      return responser.respond(res);
    }
    await user.changePassword(currentPassword, newPassword);
    let token = await user.refershToken();
    let responser = new Responser(200, 'Password changed successfully', { token });
    return responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

module.exports = { changePassword, getUserInfo };
