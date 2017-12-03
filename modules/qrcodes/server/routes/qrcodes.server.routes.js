'use strict';

/**
 * Module dependencies
 */
var qrcodesPolicy = require('../policies/qrcodes.server.policy'),
  qrcodes = require('../controllers/qrcodes.server.controller');

module.exports = function(app) {
  // Qrcodes Routes
  app.route('/api/qrcodes')//.all(qrcodesPolicy.isAllowed)
    .get(qrcodes.list)
    .post(qrcodes.create);

  app.route('/api/qrcodes/:qrcodeId')//.all(qrcodesPolicy.isAllowed)
    .get(qrcodes.read)
    .put(qrcodes.update)
    .delete(qrcodes.delete);

  // Finish by binding the Qrcode middleware
  app.param('qrcodeId', qrcodes.qrcodeByID);
};
