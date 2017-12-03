(function () {
  'use strict';

  // Qrcodes controller
  angular
    .module('qrcodes')
    .controller('QrcodesController', QrcodesController);

  QrcodesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'qrcodeResolve'];

  function QrcodesController ($scope, $state, $window, Authentication, qrcode) {
    var vm = this;

    vm.authentication = Authentication;
    vm.qrcode = qrcode;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Qrcode
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.qrcode.$remove($state.go('qrcodes.list'));
      }
    }

    // Save Qrcode
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.qrcodeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.qrcode._id) {
        vm.qrcode.$update(successCallback, errorCallback);
      } else {
        vm.qrcode.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('qrcodes.view', {
          qrcodeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
