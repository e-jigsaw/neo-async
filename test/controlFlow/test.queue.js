/* global describe, it */
'use strict';

var _ = require('lodash');
var assert = require('power-assert');
var async = require('../../');

describe('#queue', function() {

  it('should execute queue', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var delays = [160, 80, 240, 80];
    var worker = function(data, callback) {
      setTimeout(function() {
        order.process.push(data);
        callback('err', 'arg');
      }, delays.shift());
    };
    var concurrency = 2;
    var queue = async.queue(worker, concurrency);

    queue.push(1, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(1);
    });
    queue.push(2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 2);
      order.callback.push(2);
    });
    queue.push(3, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(3);
    });
    queue.push(4, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(4);
    });

    assert.strictEqual(queue.length(), 4);
    assert.strictEqual(queue.concurrency, concurrency);

    queue.drain = function() {
      assert.deepEqual(order.callback, [2, 1, 4, 3]);
      assert.deepEqual(order.process, [2, 1, 4, 3]);
      assert.strictEqual(queue.length(), 0);
      assert.strictEqual(queue.concurrency, concurrency);
      done();
    };
  });

  it('should execute queue with default concurrency', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var delays = [160, 80, 240, 80];
    var worker = function(data, callback) {
      setTimeout(function() {
        order.process.push(data);
        callback('err', 'arg');
      }, delays.shift());
    };

    var queue = async.queue(worker);

    queue.push(1, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 3);
      order.callback.push(1);
    });
    queue.push(2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 2);
      order.callback.push(2);
    });
    queue.push(3, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(3);
    });
    queue.push(4, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(4);
    });

    assert.strictEqual(queue.length(), 4);
    assert.strictEqual(queue.concurrency, 1);

    queue.drain = function() {
      assert.deepEqual(order.callback, [1, 2, 3, 4]);
      assert.deepEqual(order.process, [1, 2, 3, 4]);
      assert.strictEqual(queue.length(), 0);
      assert.strictEqual(queue.concurrency, 1);
      done();
    };
  });

  it('should execute queue and throw error', function(done) {

    var results = [];
    var iterator = function(task, callback) {
      if (task.name === 'fuga') {
        return callback(new Error('error'));
      }
      callback();
    };
    var queue = async.queue(iterator);

    queue.drain = function() {

      assert.deepEqual(results, ['hoge', 'fugaError', 'piyo']);
      done();
    };

    var names = ['hoge', 'fuga', 'piyo'];

    _.forEach(names, function(name) {

      queue.push({
        name: name
      }, function(err) {
        if (err) {
          results.push(name + 'Error');
        } else {
          results.push(name);
        }
      });
    });

  });

  it('should execute while changing concurrency', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var delays = [160, 80, 240, 80];
    var worker = function(data, callback) {
      setTimeout(function() {
        order.process.push(data);
        callback('err', 'arg');
      }, delays.shift());
    };

    var queue = async.queue(worker, 2);

    queue.push(1, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      queue.concurrency = 1;
      order.callback.push(1);
    });
    queue.push(2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 2);
      order.callback.push(2);
    });
    queue.push(3, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(3);
    });
    queue.push(4, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(4);
    });

    assert.strictEqual(queue.length(), 4);
    assert.strictEqual(queue.concurrency, 2);

    queue.drain = function() {
      assert.deepEqual(order.callback, [2, 1, 3, 4]);
      assert.deepEqual(order.process, [2, 1, 3, 4]);
      assert.strictEqual(queue.length(), 0);
      assert.strictEqual(queue.concurrency, 1);
      done();
    };

  });

  it('should execute using unshift', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var delays = [160, 80, 240, 80];
    var worker = function(data, callback) {
      setTimeout(function() {
        order.process.push(data);
        callback('err', 'arg');
      }, delays.shift());
    };

    var queue = async.queue(worker, 2);
    queue.saturated = function() {
      setTimeout(function() {
        assert.strictEqual(queue.running(), 2);
      }, 40);
    };

    queue.push(1, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      queue.concurrency = 1;
      order.callback.push(1);
    });
    queue.push(2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(2);
    });
    queue.unshift(3, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 2);
      order.callback.push(3);
    });
    queue.unshift(4, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(4);
    });

    assert.strictEqual(queue.length(), 4);
    assert.strictEqual(queue.concurrency, 2);

    queue.drain = function() {
      assert.deepEqual(order.callback, [3, 4, 2, 1]);
      assert.deepEqual(order.process, [3, 4, 2, 1]);
      assert.strictEqual(queue.length(), 0);
      assert.strictEqual(queue.concurrency, 1);
      done();
    };

  });

  it('should execute drain immediately if insert task is empty', function(done) {

    var order = [];
    var worker = function(data, callback) {
      order.push(1);
      callback();
    };
    var queue = async.queue(worker);
    queue.drain = function() {
      assert.deepEqual(order, []);
      done();
    };
    queue.push();

  });

  it('should execute empty function if task is empty', function(done) {

    var worker = function(data, callback) {
      setTimeout(function() {
        callback();
      }, 50);
    };

    var called = false;
    var queue = async.queue(worker);
    queue.empty = function() {
      assert.strictEqual(queue.length(), 0);
      called = true;
    };
    queue.push(1, function() {
      assert.strictEqual(queue.length(), 0);
    });
    queue.drain = function() {
      assert.ok(called);
      done();
    };

  });

  it('should pause, resume and kill', function(done) {

    var order = [];
    var delays = [40, 20];
    var worker = function(data, callback) {
      setTimeout(function() {
        order.push(data);
        callback();
      }, delays.shift());
    };

    var queue = async.queue(worker);
    queue.resume();
    queue.pause();
    queue.push(1, function() {
      assert.strictEqual(queue.length(), 0);
    });
    queue.push(2, function() {});
    setTimeout(function() {
      queue.resume();
    }, 100);
    setTimeout(function() {
      queue.kill();
    }, 120);
    setTimeout(function() {
      assert.deepEqual(order, [1]);
      done();
    }, 200);

  });

  it('should kill process', function(done) {

    var q = async.queue(function(task, callback) {
      setTimeout(function() {
        assert.equal(false, 'Function should never be called');
        callback();
      }, 100);
    }, 1);
    q.drain = function() {
      assert.equal(false, 'Function should never be called');
    };

    q.push(0);
    q.kill();

    setTimeout(function() {
      assert.strictEqual(q.length(), 0);
      done();
    }, 200);
  });

  it('should check events', function(done) {

    var calls = [];
    var q = async.queue(function(task, cb) {
      // nop
      calls.push('process ' + task);
      setImmediate(cb);
    }, 10);
    q.concurrency = 3;

    q.saturated = function() {
      assert.strictEqual(q.length(), 3);
      calls.push('saturated');
    };
    q.empty = function() {
      assert.strictEqual(q.length(), 0);
      calls.push('empty');
    };
    q.drain = function() {
      assert.strictEqual(q.length(), 0);
      assert.strictEqual(q.running(), 0);
      calls.push('drain');
      assert.deepEqual(calls, [
        'saturated',
        'process foo',
        'process bar',
        'process zoo',
        'foo cb',
        'process poo',
        'bar cb',
        'empty',
        'process moo',
        'zoo cb',
        'poo cb',
        'moo cb',
        'drain'
      ]);
      done();
    };
    q.push('foo', function() {
      calls.push('foo cb');
    });
    q.push('bar', function() {
      calls.push('bar cb');
    });
    q.push('zoo', function() {
      calls.push('zoo cb');
    });
    q.push('poo', function() {
      calls.push('poo cb');
    });
    q.push('moo', function() {
      calls.push('moo cb');
    });
  });

  it('should start', function(done) {

    var q = async.queue(function() {});

    assert.strictEqual(q.started, false);
    q.push([]);
    assert.strictEqual(q.started, true);
    done();
  });

  it('should check concurrency when queue paused and resumed', function(done) {

    var order = [];
    var q = async.queue(function(task, callback) {
      var name = task.name;
      order.push(['process', name]);
      setTimeout(function() {
        order.push(['called', name]);
        callback();
      }, 100);
    }, 5);

    q.pause();
    _.times(10, function(n) {
      q.push({
        name: ++n
      });
    });
    setTimeout(q.resume, 100);

    q.drain = function() {
      assert.deepEqual(order, [
        ['process', 1],
        ['process', 2],
        ['process', 3],
        ['process', 4],
        ['process', 5],
        ['called', 1],
        ['process', 6],
        ['called', 2],
        ['process', 7],
        ['called', 3],
        ['process', 8],
        ['called', 4],
        ['process', 9],
        ['called', 5],
        ['process', 10],
        ['called', 6],
        ['called', 7],
        ['called', 8],
        ['called', 9],
        ['called', 10]
      ]);
      done();
    };
  });

});

describe('#priorityQueue', function() {

  it('should execute queue by priority sequence', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var worker = function(task, callback) {
      order.process.push(task);
      callback('err', 'arg');
    };
    var queue = async.priorityQueue(worker);

    queue.push(1, 1.4, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 2);
      order.callback.push(1);
    });
    queue.push(2, 0.2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 3);
      order.callback.push(2);
    });
    queue.push(3, 3.8, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(3);
    });
    queue.push(4, 2.9, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(4);
    });

    assert.strictEqual(queue.length(), 4);
    assert.strictEqual(queue.concurrency, 1);

    queue.drain = function() {
      assert.deepEqual(order.process, [2, 1, 4, 3]);
      assert.deepEqual(order.callback, [2, 1, 4, 3]);
      assert.strictEqual(queue.concurrency, 1);
      assert.strictEqual(queue.length(), 0);
      done();
    };
  });

  it('should execute queue by priority sequence with concurrency', function(done) {

    var order = {
      callback: [],
      process: []
    };
    var delays = [160, 80, 240, 80];
    var worker = function(task, callback) {
      setTimeout(function() {
        order.process.push(task);
        callback('err', 'arg');
      }, delays.shift());
    };
    var called = false;
    var concurrency = 2;
    var queue = async.priorityQueue(worker, concurrency);
    queue.saturated = function() {
      called = true;
    };

    queue.push(1, 1.4, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 2);
      order.callback.push(1);
    });
    queue.push(2, 0.2, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 1);
      order.callback.push(2);
    });
    queue.push(3, 3.8, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(3);
    });
    queue.push(4, 2.9, function(err, arg) {
      assert.strictEqual(err, 'err');
      assert.strictEqual(arg, 'arg');
      assert.strictEqual(queue.length(), 0);
      order.callback.push(4);
    });

    assert.strictEqual(queue.length(), 4);
    assert.strictEqual(queue.concurrency, 2);

    queue.drain = function() {
      assert.deepEqual(order.process, [1, 2, 3, 4]);
      assert.deepEqual(order.callback, [1, 2, 3, 4]);
      assert.strictEqual(queue.concurrency, 2);
      assert.strictEqual(queue.length(), 0);
      assert.ok(called);
      done();
    };

  });

  it('should execute drain immediately if insert task is empty', function(done) {

    var order = [];
    var worker = function(data, callback) {
      order.push(1);
      callback();
    };
    var queue = async.priorityQueue(worker);
    queue.drain = function() {
      assert.deepEqual(order, []);
      done();
    };
    queue.push();

  });

});
