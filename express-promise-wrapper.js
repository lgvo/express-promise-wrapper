// express-promise-wrapper - Wrapper to use promises with express
// Copyright © 2015 Luis Gustavo Vilela de Oliveira
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import * as args from 'express-args-resolver';

function nullInstance() {
    return null;
}

export const argsResolver = args;

export function wrap(fn, instanceBuild, resolvers) {
    return function(req, res, next) {
        fn.apply(
            (instanceBuild || nullInstance)(), 
            (resolvers || args.getResolvers(fn)).map(function(r) {
                return r(req, res, next);
            })
        ).then(function(result) {
            if (!result) {
                res.status(204).end();
            } else {
                result.write(res);
            }
        }).catch(next);
    };
}

class TextResponse {
    constructor(str) {
        this.str = str;
    }

    write(res) {
        res.send(this.str);
    }
}

export function text(str) {
    return new TextResponse(str);
}

class JsonResponse {
    constructor(obj) {
        this.obj = obj;
    }

    write(res) {
        res.json(this.obj);
    }
}

export function json(object) {
    return new JsonResponse(object);
}

export function jsonCollection(arr) {
    return new JsonResponse({size: arr.length, data: arr});
}

class CreatedResponse {
    constructor(location, id) {
        this.id = id;
        this.location = location;
    }

    write(res) {
        if (this.location) {
            res.location(this.location);
        }

        res.status(201);

        if (this.id) {
            res.send(this.id);
        } else {
            res.end();
        }
    }
}

export function created(location, id) {
    return new CreatedResponse(location, id);
}

