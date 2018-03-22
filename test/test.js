const expect = require('chai').expect;
const programUtils = require('../');

process.argv.push('--no-arg');
process.argv.push('--mono-arg=5');
process.argv.push('--poly-arg=10,true');
process.argv.push('-n');
process.argv.push('-m=bar');
process.argv.push('-p=false,foo');
process.argv.push('-sv=ihaveit');
process.argv.push('-u');
process.argv.push('--wtf');

let res = new programUtils.argsParser()
  .addStringFlag('no-arg')
  .addStringFlag('mono-arg')
  .addStringFlag('poly-arg')
  .addCharFlag('n')
  .addCharFlag('m')
  .addCharFlag('p')
  .addCharFlag('s')
  .addCharFlag('v')
  .getResult();
console.log(JSON.stringify(res));
/* eslint-disable */
describe('The args parser', () => {
  describe('the result object', () => {
    it('should have flags and unknown properties', () => {
      expect(res).not.to.be.undefined;
      expect(res).to.have.property('flags');
      expect(res).to.have.property('unknown');
    });
    describe('mono char args', () => {
      it('should put known mono args in flags with correct values', () => {
        let flags = res.flags;
        expect(flags).to.have.property('n').and.to.be.an('array').and.to.have.lengthOf(0);
        expect(flags).to.have.property('m').and.to.be.an('array').and.to.have.lengthOf(1).and.include('bar');
        expect(flags).to.have.property('p').and.to.be.an('array').and.to.have.length.greaterThan(1).and.include(false).and.include('foo');
        expect(flags).to.have.property('s').and.to.be.an('array').and.to.have.lengthOf(0);
        expect(flags).to.have.property('v').and.to.be.an('array').and.to.have.lengthOf(1).and.include('ihaveit');
      });
    });
    describe('poly char args', () => {
      it('should put known poly args in flags with correct values', () => {
        let flags = res.flags;
        expect(flags).to.have.property('no-arg').and.to.be.an('array').and.to.have.lengthOf(0);
        expect(flags).to.have.property('mono-arg').and.to.be.an('array').and.to.have.lengthOf(1).and.include(5);
        expect(flags).to.have.property('poly-arg').and.to.be.an('array').and.to.have.length.greaterThan(1).and.include(true).and.include(10);
      });
    });
    describe('unknown args', () => {
      it('should put unknown args in unknown array', () => {
        let unknown = res.unknown;
        expect(unknown).to.include('-u').and.include('--wtf');
      });
    });
  });
});
describe('The config builder', () => {
  it('should build correctly a config', () => {
    let builder = new programUtils.configBuilder();
    builder
      .addSection('in hey')
      .addComment('this section is for a lot of things')
      .setValue('that', 'is cool')
      .setValue('in_fact', 'yes')
      .letSpace()
      .addSection('new section')
      .addComment('this is a new section')
      .addSection('');
    let string = builder.toString();
    expect(string).to.be.equal('[in hey]\n# this section is for a lot of things\nthat=is cool\nin_fact=yes\n\n[new section]\n# this is a new section\n[]\n');
  });
});
describe('The config parser', () => {
  it('should parse correctly a config', () => {
    let config = programUtils.parseConfig(`${__dirname}/testParser.conf`);
    expect(JSON.stringify(config)).to.be.equal('{"sbo":{"t":"t"},"snbo":"this is a test","tbo":"overriden","random":{"this":"is random","very_random":{"this":"is even more random !"}},"tests":{"weird_spaces":{"ok":"so this should be here","ok2":" so this would have a space at the beginning","ok4":"wo","ok5":"wo also"},"special_values":{"nbr1":5,"nbr2":5.5,"nbr3":0.5,"v1":true,"v2":false}}}');
  });
});
/* eslint-enable */
