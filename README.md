# Express Promise Wrapper

A simple wrapper to to transform promise results into express middleware style (req, res, next) functions.


## Installation

```sh
$ npm install --save express-promise-wrapper
```

## Usage

###  Express app

```javascript
var withPromise = require('express-promise-wrapper'),
    express = require('express');


var expressApp = express();

// function that return a promise
function promised(body) {
    return ...; // promise
}

express.use(withPromise.wrap(promised));

```

This will create a wrap function that calls next if catch a error and use objects returns to write to the response. 

### The return object

You should return  a object that have a write function that receives a Express.Response.
Example: 

```javascript
function promise(id) {
    return somePromise.then(function(result) {
        return {
            write: function(res) {
                res.send('text');
            }
        };
    })
}
```

The project comes with helpers to create some of this objects:

```javascript 
json(obj);
// equivalent
res.json(obj);

jsonCollection(arr);
// equivalent
res.json({size: arr.length, data: arr});

created(location, id);
// equivalent
res.location(location);
res.send(id, 201);

```

## Dependencies
[Express Arguments resolver](https://github.com/lgvo/express-args-resolver) used to resolve the arguments names.

## License
[MIT](LICENSE)
