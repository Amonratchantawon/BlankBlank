(function () {
  'use strict';

  angular
    .module('qrcodes')
    .controller('QrcodesListController', QrcodesListController);

  QrcodesListController.$inject = ['QrcodesService'];

  function QrcodesListController(QrcodesService) {
    var vm = this;

    vm.qrcodes = QrcodesService.query();
  }
}());
