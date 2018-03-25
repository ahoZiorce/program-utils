# program-utils
![build](https://img.shields.io/travis/ahoZiorce/program-utils.svg)
A module to parse arguments and to provide easy configuration file.

## Parse config
The config style is inspired from the windows INI file. But it works slightly differently.
```javascript
const programUtils = require('program-utils');
let parsedConfig = programUtils.parseConfig(filePath);
```
Exemples :
```ini
# example.conf

foo = bar
spam = true
t = false
nbr = 5.5

# you can do a comment with an '#' on a blank line
# => {foo:"bar", spam: true, t: false, nbr:5.5}
```
Every value that is not true, false, or a number is a string.

But you can do subobjects with the syntax `[obj subobj]`
```ini
# example.conf

var_in_global = bar

[test]
var_in_test_in_global = bar

[test comp]
var_in_comp_in_test_in_global = bar

# => {var_in_global:"bar",test:{var_in_test_in_global:"bar",comp:{var_in_comp_in_test_in_global:"bar"}}}
```

Notes and other examples
```ini
# example.conf

hey1 = this is a hey1
test = is this going to be overridden ?

[test]
res = yes !
# if you create a subobject with the same name as an existing property, the property will be overriden by the 
# subobject name

[]
hey2 = this is a hey2
# you can return to global scope with [], so "hey2" will be along "hey1"

[test]
# this case will not override the current test, so there is already "res" defined here
[]
test = not a subobject anymore
# if test is reassigned as a property in parent scope, the test subobject will be overriden also
[hey this is very cool]
# this scope is the "cool" object in "very" in "is" in "this" in "hey" in global
[hey this is]
# this scope targetting "is" in "this" in "hey" in global
[]
no_space= space
to_much_space=  space
# it's possible to have no space around the equal sign, or one (but more will add a space in the value)
# so in this example "no_space" is equal to "space" but "to_much_space" is equal to " space"
```

### Build a config
You might want to build a config, for example the first time your program is run, in this case you
can use the config builder.
```javascript
  const programUtils = require('program-utils');
  let builder = new programUtils.configBuilder();
  builder
    .addSection('hey') // this will add a [hey]
    .setValue('t', 't') // this will add "t=t"
    .letSpace() // this will jump a line
    .addComment()
 // .toString(); -- Returns a string containing the config content
    .toFile('./config.conf'); // Directly writes config into a file

  /*  outputs in config.conf :
  
    [hey]
    t=t

    # this is cool


  */
```

## Args parser
If you want to parse args you can do this by doing for example
```javascript
  const programUtils = require('program-utils');
  let argsParser = new programUtils.argsParser();
  let arr = ['-v'];
  let args = argsParser
  .addCharFlag('v') // Adds a mono char flag to be recognized
  .addCharFlag('h') // Adds a second
//.setSourceArray(arr, startingIndex) Sets the source array
  .addStringFlag('help') // Adds a string arg
  .getResult();
```
So now when the program is launched it will result according to args passed
For example
```json
args => "-v"
{"flags":{"v":[]},"unknown":[]}

args => "-vh"
{"flags":{"v":[],"h":[]},"unknown":[]}

args => "-vhp"
{"flags":{"v":[],"h":[]},"unknown":["p"]}

args => "-vh=45"
{"flags":{"v":[],"h":[45]},"unknown":[]}

args => "-vh=100,bar"
{"flags":{"v":[],"h":[100,"bar"]},"unknown":[]}

args => "-h=100 -v=bar"
{"flags":{"h":[100],"v":["bar"]},"unknown":[]}

args => "-h=100 -v=bar --help=true"
{"flags":{"h":[100],"v":["bar"],"help":[true]},"unknown":[]}

args => "-h=100 -v=bar --help=true --wtf"
{"flags":{"h":[100],"v":["bar"],"help":[true]},"unknown":["--wtf"]}
```

Here it is

# License

MIT