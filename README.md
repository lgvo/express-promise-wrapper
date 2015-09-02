# Express Promise Wrapper

[![Build Status](https://travis-ci.org/lgvo/express-promise-wrapper.svg?branch=master)](https://travis-ci.org/lgvo/express-promise-wrapper)
[![Coverage Status](https://coveralls.io/repos/lgvo/express-promise-wrapper/badge.svg?branch=master&service=github)](https://coveralls.io/github/lgvo/express-promise-wrapper?branch=master)
[![npm version](https://badge.fury.io/js/express-promise-wrapper.svg)](http://badge.fury.io/js/express-promise-wrapper)
[![Code Climate](https://codeclimate.com/github/lgvo/express-promise-wrapper/badges/gpa.svg)](https://codeclimate.com/github/lgvo/express-promise-wrapper)
[![npm](https://img.shields.io/npm/dm/express-promise-wrapper.svg)](https://www.npmjs.com/package/express-promise-wrapper)


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

This will create a wrap function that calls "next" callback if catch a error and use objects returns to write to the response. 

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
var json = withPromise.json,
    jsonCollection = withPromise.jsonCollection,
    created = withPromise.created;

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

## See Also
* [restful-express](https://github.com/lgvo/restful-express) declarative way to define Express routers using decorators.
* [di-decorators](https://github.com/lgvo/di-decorators) easy to use, little dependency injection framework on top of decorators

## Dependencies
* [Express Arguments resolver](https://github.com/lgvo/express-args-resolver) used to resolve the arguments names.

## Contributing

* Please take the time to star the project if you like it! "npm star express-promise-wrapper" and also on github [express-promise-wrapper](https://github.com/lgvo/express-promise-wrapper).
* Feel free to fork, and if you are planning to add more features please open a issue so we can discuss about.


## License
[MIT](LICENSE)
