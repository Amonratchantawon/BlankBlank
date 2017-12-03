(function () {
  'use strict';

  describe('Qrcodes Route Tests', function () {
    // Initialize global variables
    var $scope,
      QrcodesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _QrcodesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      QrcodesService = _QrcodesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('qrcodes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/qrcodes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          QrcodesController,
          mockQrcode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('qrcodes.view');
          $templateCache.put('modules/qrcodes/client/views/view-qrcode.client.view.html', '');

          // create mock Qrcode
          mockQrcode = new QrcodesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Qrcode Name'
          });

          // Initialize Controller
          QrcodesController = $controller('QrcodesController as vm', {
            $scope: $scope,
            qrcodeResolve: mockQrcode
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:qrcodeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.qrcodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            qrcodeId: 1
          })).toEqual('/qrcodes/1');
        }));

        it('should attach an Qrcode to the controller scope', function () {
          expect($scope.vm.qrcode._id).toBe(mockQrcode._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/qrcodes/client/views/view-qrcode.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          QrcodesController,
          mockQrcode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('qrcodes.create');
          $templateCache.put('modules/qrcodes/client/views/form-qrcode.client.view.html', '');

          // create mock Qrcode
          mockQrcode = new QrcodesService();

          // Initialize Controller
          QrcodesController = $controller('QrcodesController as vm', {
            $scope: $scope,
            qrcodeResolve: mockQrcode
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.qrcodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/qrcodes/create');
        }));

        it('should attach an Qrcode to the controller scope', function () {
          expect($scope.vm.qrcode._id).toBe(mockQrcode._id);
          expect($scope.vm.qrcode._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/qrcodes/client/views/form-qrcode.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          QrcodesController,
          mockQrcode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('qrcodes.edit');
          $templateCache.put('modules/qrcodes/client/views/form-qrcode.client.view.html', '');

          // create mock Qrcode
          mockQrcode = new QrcodesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Qrcode Name'
          });

          // Initialize Controller
          QrcodesController = $controller('QrcodesController as vm', {
            $scope: $scope,
            qrcodeResolve: mockQrcode
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:qrcodeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.qrcodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            qrcodeId: 1
          })).toEqual('/qrcodes/1/edit');
        }));

        it('should attach an Qrcode to the controller scope', function () {
          expect($scope.vm.qrcode._id).toBe(mockQrcode._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/qrcodes/client/views/form-qrcode.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
