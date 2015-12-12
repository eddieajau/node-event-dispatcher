/**
 * EventDispatcher
 *
 * @copyright Andrew Eddie 2015. All rights reserved.
 * @license   MIT
 */

/// <___reference path="../typings/tsd.d.ts"/>

import {Event} from "./Event";

// istanbul ignore next
var defer = (typeof setImmediate === 'function') ? setImmediate : function (fn: Function, ...items:any[]) {
	process.nextTick(fn.bind.apply(fn, arguments));
};

/**
 * A class to manage dispatching events and resolving when they are all complete.
 *
 * @constructor
 * @see {@link https://github.com/symfony/EventDispatcher/blob/master/EventDispatcherInterface.php}
 * @class
 */
export class EventDispatcher {
	private listeners: any = {};
	private sorted: any = {};

	/**
	 * Adds an event listener that listens on the specified events.
	 *
	 * @param {String}   eventName   - The name of the event to listen on.
	 * @param {Function} callback    - The listener callback
	 * @param {Number}   [priority]  - The higher this value, the earlier an event
	 *                               listener will be triggered in the chain (defaults to 0)
	 * @returns {EventDispatcher} The dispatcher so calls can be chained.
	 */
	public addListener(eventName: string, callback: Function, priority?: number) {
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
		}

		// Convert the priority to an integer.
		priority = priority ? +priority : 0;

		if (!this.listeners[eventName][priority]) {
			this.listeners[eventName][priority] = [];
		}

		this.listeners[eventName][priority].push(callback);

		delete this.sorted[eventName];

		return this;
	};

	/**
	 * Sort the listeners based on their priority.
	 *
	 * @param {object} listeners - An object where the keys are the integer priority, and the values are the arrays of listeners.
	 * @returns {Array} A flattened array of listeners sorted based on their priority, then order of adding.
	 * @private
	 */
	private sortListeners(listeners: any) {
		var sorted: any[] = [];

		Object
			.keys(listeners)
			.sort(function orderDescending(a: any, b: any) {
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
	public getListeners(eventName: string) {
		// See if we've sorted the listeners already.
		if (this.sorted[eventName]) {
			return this.sorted[eventName];
		}

		// No listeners for this event.
		if (!this.listeners[eventName]) {
			return [];
		}

		this.sorted[eventName] = this.sortListeners(this.listeners[eventName]);

		return this.sorted[eventName];
	};

	/**
	 * Dispatches an event to all registered listeners.
	 *
	 * @param {String} eventName - The name of the event to dispatch.
	 * @param {Event}  [event]   - The event to pass to the event handlers/listeners.
	 *                             If not supplied, an empty Event instance is created.
	 * @returns {Event} The original event is returned back. It may, however, have been modified by the event listeners.
	 */
	public dispatch(eventName: string, event?: Event) {
		var listeners = this.getListeners(eventName);
		var limit = listeners.length - 1;

		if (event === undefined) {
			event = new Event();
		}

		return new Promise(function (resolve: Function, reject: Function) {
			var index = -1;

			function next(err?: Error) {
				// TODO What to do if err is defined?
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
	public emit(eventName: string, ...items:any[]) {
		var listeners = this.getListeners(eventName);
		var args = arguments;

		listeners.forEach(function (listener: Function) {
			args[0] = listener;
			defer.apply(this, args);
		});
	};
}
