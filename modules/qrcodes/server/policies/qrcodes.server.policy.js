'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Qrcodes Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/qrcodes',
      permissions: '*'
    }, {
      resources: '/api/qrcodes/:qrcodeId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/qrcodes',
      permissions: ['get', 'post']
    }, {
      resources: '/api/qrcodes/:qrcodeId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/qrcodes',
      permissions: ['get']
    }, {
      resources: '/api/qrcodes/:qrcodeId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Qrcodes Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Qrcode is being processed and the current user created it then allow any manipulation
  if (req.qrcode && req.user && req.qrcode.user && req.qrcode.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
