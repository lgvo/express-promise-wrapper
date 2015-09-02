import chai from 'chai';

import {
    wrap, text, json, jsonCollection, created
}
from './express-promise-wrapper';

const expect = chai.expect;

describe('Wrap', function() {

    it('should wrap a function that return a callback into express middleware style', function() {
        var mid = wrap(function(body) {
            return {
                then: function(fn) {
                    fn(text(body));
                    return {
                        catch: function(fn) {}
                    };
                }
            };
        });

        var req = {
            body: 'Ok'
        };

        var test = 'notOk';
        var res = {
            send: function(str) {
                test = str;
            }
        };

        mid(req, res);

        expect(test).to.equal('Ok');

    });

    it('should call next when it catch some error', function() {

        var mid = wrap(function(body) {
            return {
                then: function(fn) {
                    return {
                        catch: function(fn) {
                            fn(new Error());
                        }
                    };
                }
            };
        });

        var error;

        function next(err) {
            error = err;
        }

        expect(error).to.not.exist;

        mid({
            body: 'test'
        }, {}, next);

        expect(error).to.exist;

    });

    it('should support pass a instanceBuilder', function() {
        var mid = wrap(function(body) {
            var self = this;
            return {
                then: function(fn) {
                    fn(text(self.result));
                    return {
                        catch: function(fn) {}
                    };
                }
            };
        }, function() {return {result: 'Ok'};});

        var req = {
            body: 'notOk'
        };

        var test = 'notOk';
        var res = {
            send: function(str) {
                test = str;
            }
        };

        mid(req, res);

        expect(test).to.equal('Ok');
    });

    it('should support define the resolvers', function() {
        var mid = wrap(function(body) {
            return {
                then: function(fn) {
                    fn(text(body));
                    return {
                        catch: function(fn) {}
                    };
                }
            };
        }, null, [function() {return 'Ok';}]);

        var req = {
            body: 'notOk'
        };

        var test = 'notOk';
        var res = {
            send: function(str) {
                test = str;
            }
        };

        mid(req, res);

        expect(test).to.equal('Ok');
    });

});

describe('Response Objects', function() {

    it('should return 204 if no response is found', function() {

        var statusCode = -1;
        var res = {
            status: (st) => {
                return {
                    end: () => {
                        statusCode = st;
                    }
                };
            }
        };
        
        var mid = wrap(function(body) {
            return {
                then: function(fn) {
                    fn(); // call withou response
                    return {
                        catch: function(fn) {}
                    };
                }
            };
        });

        mid({}, res);

        expect(statusCode).to.equal(204);
    });

    it('should write json object', function() {

        var jsonObject;

        var res = {
            json: function(obj) {
                jsonObject = obj;
            }
        };

        json({
            name: 'test'
        }).write(res);

        expect(jsonObject.name).to.equal('test');
    });

    it('should write a json collection', function() {
        var jsonObject;

        var res = {
            json: function(obj) {
                jsonObject = obj;
            }
        };

        var arr = ['1', '2', '3'];

        jsonCollection(arr).write(res);

        expect(jsonObject.size).to.equal(3);
        expect(jsonObject.data).to.eql(arr);
    });

    it('should write a created response with the location HEADER', function() {
        var res, 
            location = '',
            status = -1,
            ended = false;
        
        res = {
            location: function(l) {
                location = l;
                return res;
            },
            status: function(s) {
                status = s;
                return res;
            },
            end: function() {
                ended = true;
                return res;
            }
        };

        created('mylink').write(res);

        expect(status).to.equal(201);
        expect(location).to.equal('mylink');
        expect(ended).to.be.true;
    });

    it('should write a created response with location HEADER and return the id', function() {
        var res, 
            location = '',
            status = -1,
            data = '',
            ended = false;
        
        res = {
            location: function(l) {
                location = l;
                return res;
            },
            status: function(s) {
                status = s;
                return res;
            },
            send: function(d) {
                data = d;
                ended = true;
                return res;
            },
            end: function() {
                throw new Error('');
            }
        };

        created('mylink', 'myId').write(res);

        expect(status).to.equal(201);
        expect(location).to.equal('mylink');
        expect(data).to.equal('myId');
        expect(ended).to.be.true;
        
    });

});
