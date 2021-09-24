import { Module } from '@crash';

describe('Module', () => {
  describe('fromResponseObject', () => {
    it('should rename properties', () => {
      const responseObject = {
        order: 'Tiger Woods',
        name: 'Tony Fineau',
        address: 'Justin Thomas',
        path: 'Rickie Fowler',
        symbolsloaded: 'Jordan Speith',
        fileversion: 'Dustin Johnson',
        productversion: 'Phil Mickelson',
        checksum: 'Rory McIlroy',
        timedatestamp: 'Brooks Keopka'
      };

      const result = Module.fromResponseObject(responseObject);

      expect(result.order).toEqual(responseObject.order);
      expect(result.name).toEqual(responseObject.name);
      expect(result.address).toEqual(responseObject.address);
      expect(result.path).toEqual(responseObject.path);
      expect(result.status).toEqual(responseObject.symbolsloaded);
      expect(result.fileVersion).toEqual(responseObject.fileversion);
      expect(result.productVersion).toEqual(responseObject.productversion);
      expect(result.checksum).toEqual(responseObject.checksum);
      expect(result.timestamp).toEqual(responseObject.timedatestamp);
    });
  });
});