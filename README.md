# program-utils
A module to parse arguments and to provide easy configuration file.

## Parse config
The config style is inspired from the windows INI file. But it works slightly differently.
```javascript
const programUtils = require('program-utils');
programUtils.parseConfig(filePath);
```
Exemples :
```javascript
/*  test.conf (Note : comments are not yet implemented) */

foo = bar
spam = true
t = false
nbr = 5.5

// outputs => {foo:"bar", spam: true, t: false, nbr:5.5}
```
Every value that is not true, false, or a number is a string.
