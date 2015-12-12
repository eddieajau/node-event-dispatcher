/**
 * @copyright Andrew Eddie 2015. All rights reserved.
 * @license   MIT
 */

export interface EventInterface {
	/**
	 * Returns whether event listeners should be triggered.
	 *
	 * @returns {boolean} Whether propagation was already stopped for this event.
	 */
	isPropagationStopped(): boolean;

	/**
	 * Stops the propagation of the event to further event listeners.
	 *
	 * If multiple event listeners are connected to the same event, no
	 * further event listener will be triggered once any trigger calls
	 * stopPropagation().
	 */
	stopPropagation(): void;
}
