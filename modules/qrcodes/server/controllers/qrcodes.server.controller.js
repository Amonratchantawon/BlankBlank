'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Qrcode = mongoose.model('Qrcode'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Qrcode
 */
exports.create = function(req, res) {
  var qrcode = new Qrcode(req.body);
  qrcode.user = req.user;

  qrcode.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(qrcode);
    }
  });
};

/**
 * Show the current Qrcode
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var qrcode = req.qrcode ? req.qrcode.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  qrcode.isCurrentUserOwner = req.user && qrcode.user && qrcode.user._id.toString() === req.user._id.toString();

  res.jsonp(qrcode);
};

/**
 * Update a Qrcode
 */
exports.update = function(req, res) {
  var qrcode = req.qrcode;

  qrcode = _.extend(qrcode, req.body);

  qrcode.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(qrcode);
    }
  });
};

/**
 * Delete an Qrcode
 */
exports.delete = function(req, res) {
  var qrcode = req.qrcode;

  qrcode.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(qrcode);
    }
  });
};

/**
 * List of Qrcodes
 */
exports.list = function(req, res) {
  Qrcode.find().sort('-created').populate('user', 'displayName').exec(function(err, qrcodes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(qrcodes);
    }
  });
};

/**
 * Qrcode middleware
 */
exports.qrcodeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Qrcode is invalid'
    });
  }

  Qrcode.findById(id).populate('user', 'displayName').exec(function (err, qrcode) {
    if (err) {
      return next(err);
    } else if (!qrcode) {
      return res.status(404).send({
        message: 'No Qrcode with that identifier has been found'
      });
    }
    req.qrcode = qrcode;
    next();
  });
};
