/* global describe, it */
'use strict';

var assert = require('power-assert');
var async = require('../../');
var delay = require('../config').delay;

function someIterator(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(num);
      callback(num % 2);
    }, num * delay);
  };
}

function someIteratorWithError(order) {

  return function(num, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push(num);
      callback(null, num % 2);
    }, num * delay);
  };
}

function someIteratorWithKey(order) {

  return function(num, key, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([num, key]);
      callback(num % 2);
    }, num * delay);
  };
}

function someIteratorWithKeyAndError(order) {

  return function(num, key, callback) {

    var self = this;

    setTimeout(function() {

      if (self && self.round) {
        num = self.round(num);
      }
      order.push([num, key]);
      callback(null, num % 2);
    }, num * delay);
  };
}

describe('#some', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.some(collection, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.some(collection, someIteratorWithKey(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [
        [1, 0]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of array and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.some(collection, someIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.some(collection, someIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [1, 0]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.some(collection, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.some(collection, someIteratorWithKey(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [
        [2, 'c'],
        [3, 'b']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.some(collection, someIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [2, 3]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.some(collection, someIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [2, 'c'],
        [3, 'b']
      ]);
      done();
    });
  });

  it('should execute iterator with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.some(collection, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    }, Math);
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.some([], someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.some(function() {}, someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.some(undefined, someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.some(null, someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#someSeries', function() {

  it('should execute iterator by collection of array', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.someSeries(collection, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.someSeries(collection, someIteratorWithKey(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [
        [1, 0]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of array and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.someSeries(collection, someIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [1, 3, 2, 4];
    async.someSeries(collection, someIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [1, 0]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.someSeries(collection, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [5]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.someSeries(collection, someIteratorWithKey(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [
        [5, 'a']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.someSeries(collection, someIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [5]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 5,
      b: 3,
      c: 2
    };
    async.someSeries(collection, someIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [5, 'a']
      ]);
      done();
    });
  });

  it('should execute iterator with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.6
    };

    async.someSeries(collection, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    }, Math);
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.someSeries([], someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.someSeries(function() {}, someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });

  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.someSeries(undefined, someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.someSeries(null, someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

});

describe('#someLimit', function() {

  it('should execute iterator in limited by collection of array', function(done) {

    var order = [];
    var collection = [2, 4, 3, 2];

    async.someLimit(collection, 2, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator in limited by collection of array with passing index', function(done) {

    var order = [];
    var collection = [2, 4, 3, 2];

    async.someLimit(collection, 2, someIteratorWithKey(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [
        [2, 0],
        [4, 1],
        [3, 2]
      ]);
      done();
    });
  });

  it('should execute iterator by collection of array and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [2, 4, 3, 2];

    async.someLimit(collection, 2, someIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator by collection of array with passing index and get 2rd callback argument', function(done) {

    var order = [];
    var collection = [2, 4, 3, 2];

    async.someLimit(collection, 2, someIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [2, 0],
        [4, 1],
        [3, 2]
      ]);
      done();
    });
  });

  it('should execute iterator to series by collection of object', function(done) {

    var order = [];
    var collection = {
      a: 2,
      b: 4,
      c: 3,
      d: 2
    };
    async.someLimit(collection, 2, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator to series by collection of object with passing key', function(done) {

    var order = [];
    var collection = {
      a: 2,
      b: 4,
      c: 3,
      d: 2
    };
    async.someLimit(collection, 2, someIteratorWithKey(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [
        [2, 'a'],
        [4, 'b'],
        [3, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator by collection of object and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 2,
      b: 4,
      c: 3,
      d: 2
    };
    async.someLimit(collection, 2, someIteratorWithError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [2, 4, 3]);
      done();
    });
  });

  it('should execute iterator by collection of object with passing key and get 2rd callback argument', function(done) {

    var order = [];
    var collection = {
      a: 2,
      b: 4,
      c: 3,
      d: 2
    };
    async.someLimit(collection, 2, someIteratorWithKeyAndError(order), function(err, res) {
      if (err) {
        return done(err);
      }
      assert.ok(res);
      assert.deepEqual(order, [
        [2, 'a'],
        [4, 'b'],
        [3, 'c']
      ]);
      done();
    });
  });

  it('should execute iterator to series with binding', function(done) {

    var order = [];
    var collection = {
      a: 1.1,
      b: 3.5,
      c: 2.7
    };

    async.someLimit(collection, 2, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    }, Math);
  });

  it('should execute like parallel if limit is Infinity', function(done) {

    var order = [];
    var collection = [2, 3, 1];

    async.someLimit(collection, Infinity, someIterator(order), function(res) {
      assert.ok(res);
      assert.deepEqual(order, [1]);
      done();
    });
  });

  it('should return response immediately if collection is empty', function(done) {

    var order = [];
    async.someLimit([], 2, someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is function', function(done) {

    var order = [];
    async.someLimit(function() {}, 2, someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is undefined', function(done) {

    var order = [];
    async.someLimit(undefined, 2, someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if collection is null', function(done) {

    var order = [];
    async.someLimit(null, 2, someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is zero', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.someLimit(collection, 0, someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

  it('should return response immediately if limit is undefined', function(done) {

    var order = [];
    var collection = [1, 3, 2];
    async.someLimit(collection, undefined, someIterator(order), function(res) {
      assert.strictEqual(res, false);
      assert.deepEqual(order, []);
      done();
    });
  });

});
