/**
 * EventDispatcher
 *
 * @copyright Andrew Eddie 2015. All rights reserved.
 * @license   MIT
 */

"use strict";

var Event = require('./Event');
var priority = require('./priority');

// istanbul ignore next
var defer = (typeof setImmediate === 'function') ? setImmediate : function (fn) {
	process.nextTick(fn.bind.apply(fn, arguments));
};

/**
 * A class to manage dispatching events and resolving when they are all complete.
 *
 * @constructor
 * @see {@link https://github.com/symfony/EventDispatcher/blob/master/EventDispatcherInterface.php}
 * @class
 */
function EventDispatcher() {
	this._listeners = [];
	this._sorted = [];
}

/**
 * @type {Event}
 * @static
 */
EventDispatcher.Event = Event;
EventDispatcher.priority = priority;

/**
 * Adds an event listener that listens on the specified events.
 *
 * @param {String}   eventName   - The name of the event to listen on.
 * @param {Function} callback    - The listener callback
 * @param {integer}  [priority]  - The higher this value, the earlier an event
 *                               listener will be triggered in the chain (defaults to 0)
 * @returns {EventDispatcher} The dispatcher so calls can be chained.
 */
EventDispatcher.prototype.addListener = function (eventName, callback, priority) {
	if (!this._listeners[eventName]) {
		this._listeners[eventName] = [];
	}

	// Convert the priority to an integer.
	priority = priority ? +priority : 0;

	if (!this._listeners[eventName][priority]) {
		this._listeners[eventName][priority] = [];
	}

	this._listeners[eventName][priority].push(callback);

	delete this._sorted[eventName];

	return this;
};

/**
 * Sort the listeners based on their priority.
 *
 * @param {object} listeners - An object where the keys are the integer priority, and the values are the arrays of listeners.
 * @returns {Array} A flattened array of listeners sorted based on their priority, then order of adding.
 * @private
 */
EventDispatcher.prototype._sortListeners = function (listeners) {
	var sorted = [];

	Object
		.keys(listeners)
		.sort(function orderDescending(a, b) {
			return b - a;
		})
		.forEach(function (priority) {
			sorted = sorted.concat(listeners[priority]);
		});

	return sorted;
};

/**
 * Gets the listeners of a specific event.
 *
 * @param {String} eventName - The name of the event.
 * @returns {Array.<Function>} - An array of function listeners (to call).
 */
EventDispatcher.prototype.getListeners = function (eventName) {
	// See if we've sorted the listeners already.
	if (this._sorted[eventName]) {
		return this._sorted[eventName];
	}

	// No listeners for this event.
	if (!this._listeners[eventName]) {
		return [];
	}

	this._sorted[eventName] = this._sortListeners(this._listeners[eventName]);

	return this._sorted[eventName];
};

/**
 * Dispatches an event to all registered listeners.
 *
 * @param {String} eventName - The name of the event to dispatch.
 * @param {Event}  [event]   - The event to pass to the event handlers/listeners.
 *                             If not supplied, an empty Event instance is created.
 * @returns {Event} The original event is returned back. It may, however, have been modified by the event listeners.
 */
EventDispatcher.prototype.dispatch = function (eventName, event) {
	var listeners = this.getListeners(eventName);
	var limit = listeners.length - 1;

	if (event === undefined) {
		event = new Event();
	}

	return new Promise(function (resolve, reject) {
		var index = -1;

		function next(err) {
			if (err instanceof Error) {
				reject(err);
			}

			if (event.isPropagationStopped() || index >= limit) {
				return resolve(event);
			}

			index += 1;
			defer(listeners[index], event, next);
		}

		next();
	});
};

/**
 * Emits an event to all registered listeners without returning on completion.
 *
 * This is different from `dispatch` in that it doesn't resolve, does not pass an event around and priority is unreliable.
 *
 * @param {String} eventName - The name of the event to dispatch.
 */
EventDispatcher.prototype.emit = function (eventName) {
	var listeners = this.getListeners(eventName);
	var args = arguments;

	listeners.forEach(function (listener) {
		args[0] = listener;
		defer.apply(this, args);
	});
};

module.exports = EventDispatcher;
