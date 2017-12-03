(function () {
  'use strict';

  angular
    .module('qrcodes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('qrcodes', {
        abstract: true,
        url: '/qrcodes',
        template: '<ui-view/>'
      })
      .state('qrcodes.list', {
        url: '',
        templateUrl: 'modules/qrcodes/client/views/list-qrcodes.client.view.html',
        controller: 'QrcodesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Qrcodes List'
        }
      })
      .state('qrcodes.create', {
        url: '/create',
        templateUrl: 'modules/qrcodes/client/views/form-qrcode.client.view.html',
        controller: 'QrcodesController',
        controllerAs: 'vm',
        resolve: {
          qrcodeResolve: newQrcode
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Qrcodes Create'
        }
      })
      .state('qrcodes.edit', {
        url: '/:qrcodeId/edit',
        templateUrl: 'modules/qrcodes/client/views/form-qrcode.client.view.html',
        controller: 'QrcodesController',
        controllerAs: 'vm',
        resolve: {
          qrcodeResolve: getQrcode
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Qrcode {{ qrcodeResolve.name }}'
        }
      })
      .state('qrcodes.view', {
        url: '/:qrcodeId',
        templateUrl: 'modules/qrcodes/client/views/view-qrcode.client.view.html',
        controller: 'QrcodesController',
        controllerAs: 'vm',
        resolve: {
          qrcodeResolve: getQrcode
        },
        data: {
          pageTitle: 'Qrcode {{ qrcodeResolve.name }}'
        }
      });
  }

  getQrcode.$inject = ['$stateParams', 'QrcodesService'];

  function getQrcode($stateParams, QrcodesService) {
    return QrcodesService.get({
      qrcodeId: $stateParams.qrcodeId
    }).$promise;
  }

  newQrcode.$inject = ['QrcodesService'];

  function newQrcode(QrcodesService) {
    return new QrcodesService();
  }
}());
