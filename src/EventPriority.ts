/**
 * @copyright Andrew Eddie 2015. All rights reserved.
 * @license   MIT
 */

/**
 * An enumeration of default event priority levels.
 *
 * Three orders of magnitude separate each level.
 *
 * @type {{HIGHEST: number, HIGHER: number, HIGH: number, NORMAL: number, LOW: number, LOWER: number, LOWEST: number}}
 */
export var EventPriority = {
	HIGHEST: 1000000000,
	HIGHER: 1000000,
	HIGH: 1000,
	NORMAL: 0,
	LOW: -1000,
	LOWER: -1000000,
	LOWEST: -1000000000
};
