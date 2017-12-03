// Qrcodes service used to communicate Qrcodes REST endpoints
(function () {
  'use strict';

  angular
    .module('qrcodes')
    .factory('QrcodesService', QrcodesService);

  QrcodesService.$inject = ['$resource'];

  function QrcodesService($resource) {
    return $resource('api/qrcodes/:qrcodeId', {
      qrcodeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
