var whatsAppParser = require('../src/parser');
var chai = require('chai');
var expect = chai.expect;

describe('WhatsApp Parser', function () {

  describe('#parseChat', function () {

    it('added', function () {

      expect(
        whatsAppParser.parseChat('\n\n28/07/2012 16:56:36: FIRST O\'LAST was added\n\n')
      ).deep.equal([
        {
          date: new Date('2012-07-28T15:56:36.000Z'),
          name: 'FIRST O\'LAST',
          type: 'added',
        }
      ]);

    });

    it('addedBy', function () {

      expect(
          whatsAppParser.parseChat('\n\n28/07/2012 16:56:36: FIRST O\'LAST added\u202A+44 9999 999999\n\n')
      ).deep.equal([
        {
          addedByName: 'FIRST O\'LAST',
          date: new Date('2012-07-28T15:56:36.000Z'),
          name: '+44 9999 999999',
          type: 'addedBy',
        }
      ]);

    });

    it('removed', function () {

      expect(
        whatsAppParser.parseChat('\n\n28/07/2012 16:56:36: FIRST O\'LAST was removed\n\n')
      ).deep.equal([
        {
          date: new Date('2012-07-28T15:56:36.000Z'),
          name: 'FIRST O\'LAST',
          type: 'removed',
        }
      ]);

    });

    it('changed', function () {

      expect(
        whatsAppParser.parseChat('\n\n28/07/2012 16:56:36: FIRST O\'LAST changed from +44 9999 999991 to +44 9999 999992\n\n')
      ).deep.equal([
        {
          date: new Date('2012-07-28T15:56:36.000Z'),
          name: 'FIRST O\'LAST',
          type: 'changed',
        }
      ]);

    });

    it('changed', function () {

      expect(
        whatsAppParser.parseChat('\n\n28/07/2012 16:56:36: FIRST O\'LAST changed from +44 9999 999991 to +44 9999 999992\n\n')
      ).deep.equal([
        {
          date: new Date('2012-07-28T15:56:36.000Z'),
          name: 'FIRST O\'LAST',
          type: 'changed',
        }
      ]);

    });

    it('changed alt', function () {

      expect(
        whatsAppParser.parseChat('\n\n28/07/2012 16:56:36: +44 9999 999991 changed to +44 9999 999992\n\n')
      ).deep.equal([
        {
          date: new Date('2012-07-28T15:56:36.000Z'),
          name: '+44 9999 999991',
          type: 'changed',
        }
      ]);

    });

    it('exit', function () {

      expect(
        whatsAppParser.parseChat('\n\n28/07/2012 16:56:36: FIRST O\'LAST left\n\n')
      ).deep.equal([
        {
          date: new Date('2012-07-28T15:56:36.000Z'),
          name: 'FIRST O\'LAST',
          type: 'exit',
        }
      ]);

    });

    it('icon', function () {

      expect(
          whatsAppParser.parseChat('\n\n28/07/2012 16:56:36: FIRST O\'LAST changed this group\'s icon\n\n')
      ).deep.equal([
        {
          date: new Date('2012-07-28T15:56:36.000Z'),
          name: 'FIRST O\'LAST',
          type: 'icon',
        }
      ]);

    });

    it('topic', function () {

      expect(
          whatsAppParser.parseChat('\n\n28/07/2012 16:56:36: FIRST O\'LAST changed the subject to “TOPIC STRING”\n\n')
      ).deep.equal([
        {
          date: new Date('2012-07-28T15:56:36.000Z'),
          name: 'FIRST O\'LAST',
          topic: 'TOPIC STRING',
          type: 'topic',
        }
      ]);

    });

    it('topic', function () {

      expect(
          whatsAppParser.parseChat('\n\n28/07/2012 16:56:36: FIRST O\'LAST: hello\n\n how aren\'t you?')
      ).deep.equal([
        {
          date: new Date('2012-07-28T15:56:36.000Z'),
          name: 'FIRST O\'LAST',
          message: 'hello\n how aren\'t you?',
          type: 'message',
        }
      ]);

    });

  });

});
