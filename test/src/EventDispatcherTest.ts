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

var sinon = require('sinon');

import * as assert from "assert";
import * as index from "../../src/index";
import {EventInterface} from "../../src/index";

let EventDispatcher = index.EventDispatcher;
let Event = index.Event;
let EventPriority = index.EventPriority;

class MyEvent extends Event {
	public listener1:any;
	public listener2:any;
}

suite('EventDispatcher', function () {
	function listener(value: any) {
		return function () {
			return value;
		};
	}

	test('should be exported by the package index', function () {
		var main = require('app-root-path').require('/dist/src/index.js');

		assert(main.EventDispatcher === EventDispatcher);
		assert(main.Event === Event);
		assert(main.EventPriority === EventPriority);
	});

	test('should be able to chain addListeners', function () {
		var instance = new EventDispatcher();

		assert(instance.addListener('event', console.log) === instance);
	});

	test('should not get any listeners for an unknown event', function () {
		var instance = new EventDispatcher();

		instance.addListener('event', console.log);

		var listeners = instance.getListeners('unknown');

		assert.equal(listeners.length, EventPriority.NORMAL);
	});

	test('should be able to add listeners with EventPriority', function () {
		var instance = new EventDispatcher();

		instance.addListener('event', listener('1st'), EventPriority.LOW);
		instance.addListener('event', listener('2nd'), EventPriority.HIGH);
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
		var spy = sinon.spy(instance, 'sortListeners');

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
			.then(function (result: any) {
				assert(result instanceof Event, 'the dispatcher should return an event');
			});
	});

	test('dispatch should pass the event to each listener', function () {
		var instance = new EventDispatcher();
		var myEvent = new MyEvent();

		return instance
			.addListener('event', function listener1(event: any, next: Function) {
				event.listener1 = true;
				next();
			})
			.addListener('event', function listener2(event: any, next: Function) {
				event.listener2 = true;
				next();
			})
			.dispatch('event', myEvent)
			.then(function (event: MyEvent) {
				assert.equal(event.listener1, true, 'should have called listener 1');
				assert.equal(event.listener2, true, 'should have called listener 2');
			});
	});

	test('dispatch should stop propagation if an event makes it so', function () {
		var instance = new EventDispatcher();

		return instance
			.addListener('event', function listener1(event: any, next: Function) {
				event.listener1 = true;
				event.stopPropagation();
				next();
			})
			.addListener('event', function listener2(event: any, next: Function) {
				event.listener2 = true;
				next();
			})
			.dispatch('event')
			.then(function (event: MyEvent) {
				assert.equal(event.listener1, true, 'should have called listener 1');
				assert.equal(event.listener2, undefined, 'should never have invoke listener 2');
				assert(event.isPropagationStopped(), 'event should have marked propagation stopped');
			});
	});

	test('dispatch should reject if an event passes an error', function (done) {
		var instance = new EventDispatcher();

		return instance
			.addListener('event', function listener1(event: any, next: Function) {
				next(new Error('stop!'));
			})
			.dispatch('event')
			.catch((err: Error) => {
				assert.equal(err.message, 'stop!');
				done();
			})
			.catch(done);
	});

	test('emit should work like Nodes native event emitter', function (done) {
		var instance = new EventDispatcher();
		var called: any = {};
		var isDone = function() {
			if (called.listener3 && called.listener4) {
				done();
			}
		};

		return instance
			.addListener('event', function listener3(arg1: any, arg2: any) {
				assert.equal(arg1, 'foo');
				assert.equal(arg2, 'bar');
				called.listener3 = true;
				isDone();
			})
			.addListener('event', function listener4(arg1: any, arg2: any) {
				assert.equal(arg1, 'foo');
				assert.equal(arg2, 'bar');
				called.listener4 = true;
				isDone();
			})
			.emit('event', 'foo', 'bar');
	});
});
