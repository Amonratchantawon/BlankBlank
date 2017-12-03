(function () {
  'use strict';

  angular
    .module('qrcodes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Qrcodes',
      state: 'qrcodes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'qrcodes', {
      title: 'List Qrcodes',
      state: 'qrcodes.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'qrcodes', {
      title: 'Create Qrcode',
      state: 'qrcodes.create',
      roles: ['user']
    });
  }
}());
