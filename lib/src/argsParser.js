function getValues(arr) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 'true') {
      res.push(true);
    }
    else if (arr[i] === 'false') {
      res.push(false);
    }
    else if (!isNaN(arr[i])) {
      res.push(parseFloat(arr[i]));
    }
    else {
      res.push(arr[i]);
    }
  }
  return res;
}

module.exports = class argsParser {
  constructor() {
    this.args = {
      mono: [],
      poly: [],
    };
    this.array = process.argv;
    this.startingPoint = 2;
  }
  setSourceArray(arr, sp) {
    this.array = arr;
    this.startingPoint = sp || 0;
  }
  addCharFlag(name) {
    if (name.length > 1) {
      throw new Error('Invalid char');
    }
    this.args.mono.push(name);
    return this;
  }
  addStringFlag(name) {
    this.args.poly.push(name);
    return this;
  }
  getResult() {
    let res = {
      flags: {},
      unknown: [],
    };
    let argv = this.array;
    for (let i = this.startingPoint; i < argv.length; i++) {
      let polyMatch = argv[i].match(/^--(.+?)(?:=(.*))?$/);
      let monoMatch = argv[i].match(/^-(.+?)(?:=(.*))?$/);
      if (polyMatch) {
        if (this.args.poly.indexOf(polyMatch[1]) > -1) {
          let values = [];
          if (polyMatch[2]) {
            values = polyMatch[2].split(/,/g);
          }
          res.flags[polyMatch[1]] = getValues(values) || [];
        }
        else {
          res.unknown.push(argv[i]);
        }
      }
      else if (monoMatch) {
        let lastMono;
        let chars = monoMatch[1];
        for (let j = 0; j < chars.length; j++) {
          if (this.args.mono.indexOf(chars[j]) > -1) {
            res.flags[chars[j]] = [];
            lastMono = chars[j];
          }
          else {
            res.unknown.push(`-${chars[j]}`);
          }
        }
        if (monoMatch[2] && lastMono) {
          let values = monoMatch[2].split(/,/g);
          res.flags[lastMono] = getValues(values);
        }
      }
      else {
        res.unknown.push([argv[i]]);
      }
    }
    return res;
  }
};
