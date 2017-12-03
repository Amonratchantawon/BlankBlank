'use strict';

describe('Qrcodes E2E Tests:', function () {
  describe('Test Qrcodes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/qrcodes');
      expect(element.all(by.repeater('qrcode in qrcodes')).count()).toEqual(0);
    });
  });
});
