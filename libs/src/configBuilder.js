const fs = require('fs');

module.exports = class configBuilder {
  constructor() {
    this.string = '';
  }

  addSection(sections) {
    this.string += `[${sections}]\n`;
    return this;
  }

  setValue(first, second) {
    this.string += `${first}=${second}\n`;
    return this;
  }

  letSpace() {
    this.string += `\n`;
    return this;
  }

  toString() {
    return this.string;
  }

  toFile(file) {
    fs.writeFileSync(file, this.toString());
  }
};
