import { should } from 'chai';
import { formatBigint } from '../src/utils/helpers';

should();

describe('Utilities', () => {
  describe('formatBigint', () => {
    it('Should return input when the input is less than 1000', () => {
      formatBigint(0n).should.equal('0');
      formatBigint(540n).should.equal('540');
    });
    it('Should return input above 1,000 as K (with 2 decimal places)', () => {
      formatBigint(1544n).should.equal('1.54K');
      formatBigint(256012n).should.equal('256.01K');
    });
    it('Should return input above 1,000,000 as M (with 2 decimal places)', () => {
      formatBigint(5256012n).should.equal('5.26M');
      formatBigint(143563423n).should.equal('143.56M');
    });
    it('Should return input above 1,000,000,000 as B (with 2 decimal places)', () => {
      formatBigint(1640245534n).should.equal('1.64B');
      formatBigint(230142785023n).should.equal('230.14B');
    });
    it('Should return input above 1,000,000,000,000 as T (with 2 decimal places)', () => {
      formatBigint(1453640245534n).should.equal('1.45T');
      formatBigint(67238957315807n).should.equal('67.24T');
    });
    it('Should return input above 100,000,000,000,000 as T (with 1 decimal place)', () => {
      formatBigint(230142785023754n).should.equal('230.1T');
      formatBigint(6404393023732734n).should.equal('6404.4T');
      formatBigint(58395728053750283n).should.equal('58395.7T');
    });
  });
});
