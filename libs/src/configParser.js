const fs = require('fs');

module.exports = function configParser(file) {
  let config = {};
  let last = config;
  const lines = fs.readFileSync(file, 'utf-8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    let classMatch = line.match(/^\[\s*([a-zA-Z0-9_ ]*)\s*\]$/);
    let assignMatch = line.match(/^([a-zA-Z0-9_]+) ?= ?(.+)$/);
    if (classMatch) {
      last = config;
      let classes = classMatch[1].split(/ /g);
      if (classes[0] === '') {
        continue;
      }
      for (let j = 0; j < classes.length; j++) {
        if (classes[j] === '') {
          continue;
        }
        else if (last[classes[j]] !== null && typeof last[classes[j]] !== 'object') {
          last[classes[j]] = {};
          last = last[classes[j]];
        }
        else if (last[classes[j]]) {
          last = last[classes[j]];
        }
        else {
          last[classes[j]] = {};
          last = last[classes[j]];
        }
      }
    }
    else if (assignMatch) {
      let first = assignMatch[1];
      let second = assignMatch[2];
      if (second === 'true') {
        last[first] = true;
      }
      else if (second === 'false') {
        last[first] = false;
      }
      else if (!isNaN(second)) {
        last[first] = parseFloat(second);
      }
      else {
        last[first] = second;
      }
    }
  }
  return config;
};
