/**
 * EventDispatcher tests.
 *
 * Remember to observe the 4 A's of testing and try to limit tests to just four calls:
 * - Arrange    - set up the system state
 * - Act        - do the thing we are testing
 * - Assert     - inspect the resulting state
 * - Annihilate - tear down
 *
 * @copyright Andrew Eddie 2015. All rights reserved.
 * @license   MIT
 */

var assert = require('assert');
var sinon = require('sinon');

var EventDispatcher = require('app-root-path').require('/lib/EventDispatcher');
var Event = EventDispatcher.Event;
var priority = EventDispatcher.priority;

suite('EventDispatcher', function () {
	function listener(value) {
		return function () {
			return value;
		};
	}

	test('should be exported by the package index', function () {
		var index = require('app-root-path').require('/lib');

		assert(index === EventDispatcher);
	});

	test('should be able to chain addListeners', function () {
		var instance = new EventDispatcher();

		assert(instance.addListener('event', console.log) === instance);
	});

	test('should not get any listeners for an unknown event', function () {
		var instance = new EventDispatcher();

		instance.addListener('event', console.log);

		var listeners = instance.getListeners('unknown');

		assert.equal(listeners.length, priority.NORMAL);
	});

	test('should be able to add listeners with priority', function () {
		var instance = new EventDispatcher();

		instance.addListener('event', listener('1st'), priority.LOW);
		instance.addListener('event', listener('2nd'), priority.HIGH);
		instance.addListener('another', listener('3rd'));
		instance.addListener('event', listener('4th'));
		instance.addListener('event', listener('5th'));

		var listeners = instance.getListeners('event');

		assert.equal(listeners.length, 4);
		assert.equal(listeners[0](), '2nd');
		assert.equal(listeners[1](), '4th');
		assert.equal(listeners[2](), '5th');
		assert.equal(listeners[3](), '1st');
	});

	test('adding listeners to an existing event should reset the sorting', function () {
		var instance = new EventDispatcher();
		var spy = sinon.spy(instance, '_sortListeners');

		instance.addListener('event', listener('1st'));
		instance.addListener('another', listener('1st'));
		assert.equal(instance.getListeners('event').length, 1);
		assert.equal(instance.getListeners('another').length, 1);
		assert.equal(spy.callCount, 2);

		instance.addListener('event', listener('2nd'));
		assert.equal(instance.getListeners('event').length, 2);
		assert.equal(spy.callCount, 3, 'should have called the method to sort the listeners again');

		assert.equal(instance.getListeners('another').length, 1);
		assert.equal(spy.callCount, 3, 'should have got the sorted list out of cache');
	});

	test('dispatch should return an Event if one was not supplied.', function () {
		var instance = new EventDispatcher();

		return instance.dispatch('event')
			.then(function (result) {
				assert(result instanceof Event, 'Event', 'the dispatcher should return an event');
			});
	});

	test('dispatch should pass the event to each listener', function () {
		var instance = new EventDispatcher();
		var myEvent = new Event();

		return instance
			.addListener('event', function listener1(event, next) {
				event.listener1 = true;
				next();
			})
			.addListener('event', function listener2(event, next) {
				event.listener2 = true;
				next();
			})
			.dispatch('event', myEvent)
			.then(function (result) {
				assert.equal(myEvent.listener1, true, 'should have called listener 1');
				assert.equal(myEvent.listener2, true, 'should have called listener 2');
			});
	});

	test('dispatch should stop proagation if an event makes it so', function () {
		var instance = new EventDispatcher();

		return instance
			.addListener('event', function listener1(event, next) {
				event.listener1 = true;
				event.stopPropagation();
				next();
			})
			.addListener('event', function listener2(event, next) {
				event.listener2 = true;
				next();
			})
			.dispatch('event')
			.then(function (event) {
				assert.equal(event.listener1, true, 'should have called listener 1');
				assert.equal(event.listener2, undefined, 'should never have invoke listener 2');
				assert(event.isPropagationStopped(), 'event should have marked propagation stopped');
			});
	});

	test('emit should work like Nodes native event emitter', function (done) {
		var instance = new EventDispatcher();
		var called = {};
		var isDone = function() {
			if (called.listener3 && called.listener4) {
				done();
			}
		};

		return instance
			.addListener('event', function listener3(arg1, arg2) {
				assert.equal(arg1, 'foo');
				assert.equal(arg2, 'bar');
				called.listener3 = true;
				isDone();
			})
			.addListener('event', function listener4(arg1, arg2) {
				assert.equal(arg1, 'foo');
				assert.equal(arg2, 'bar');
				called.listener4 = true;
				isDone();
			})
			.emit('event', 'foo', 'bar');
	});

});
