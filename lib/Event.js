/**
 * Event
 *
 * @copyright Andrew Eddie 2015. All rights reserved.
 * @license   MIT
 */

"use strict";

/**
 * Base event class.
 *
 * This class contains no event data. It is used by events that do not pass
 * state information to an event handler when an event is raised.
 *
 * @constructor
 * @see Based on {@link https://github.com/symfony/EventDispatcher/blob/master/Event.php}
 * @class
 */
function Event() {
	this._stopped = false;
}

/**
 * Returns whether event listeners should be triggered.
 *
 * @returns {boolean} Whether propagation was already stopped for this event.
 */
Event.prototype.isPropagationStopped = function () {
	return this._stopped;
};

/**
 * Stops the propagation of the event to further event listeners.
 *
 * If multiple event listeners are connected to the same event, no
 * further event listener will be triggered once any trigger calls
 * stopPropagation().
 */
Event.prototype.stopPropagation = function () {
	this._stopped = true;
};

module.exports = Event;
