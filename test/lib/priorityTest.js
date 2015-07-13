/**
 * Event tests.
 *
 * Remember to observe the 4 A's of testing and try to limit tests to just four calls:
 * - Arrange    - set up the system state
 * - Act        - do the thing we are testing
 * - Assert     - inspect the resulting state
 * - Annihilate - tear down
 */

var assert = require('assert');
var priority = require('app-root-path').require('/lib/priority');

suite('Event priority', function () {
	test('should include a range of priorities', function () {
		assert(Number.isInteger(priority.LOWEST) && priority.LOWEST < priority.LOWER);
		assert(Number.isInteger(priority.LOWER) && priority.LOWER < priority.LOW);
		assert(Number.isInteger(priority.LOW) && priority.LOW < priority.NORMAL);
		assert(Number.isInteger(priority.NORMAL) && priority.NORMAL === 0);
		assert(Number.isInteger(priority.HIGH) && priority.HIGH > priority.NORMAL);
		assert(Number.isInteger(priority.HIGHER) && priority.HIGHER > priority.HIGH);
		assert(Number.isInteger(priority.HIGHEST) && priority.HIGHEST > priority.HIGHER);
	});
});
