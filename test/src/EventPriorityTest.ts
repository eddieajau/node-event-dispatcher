/**
 * EventPriority tests.
 *
 * Remember to observe the 4 A's of testing and try to limit tests to just four calls:
 * - Arrange    - set up the system state
 * - Act        - do the thing we are testing
 * - Assert     - inspect the resulting state
 * - Annihilate - tear down
 */

import * as assert from "assert";
import {EventPriority} from "../../src/EventPriority";

suite('Event priority', function () {
	test('should include a range of priorities', function () {
		assert(Number.isInteger(EventPriority.LOWEST) && EventPriority.LOWEST < EventPriority.LOWER);
		assert(Number.isInteger(EventPriority.LOWER) && EventPriority.LOWER < EventPriority.LOW);
		assert(Number.isInteger(EventPriority.LOW) && EventPriority.LOW < EventPriority.NORMAL);
		assert(Number.isInteger(EventPriority.NORMAL) && EventPriority.NORMAL === 0);
		assert(Number.isInteger(EventPriority.HIGH) && EventPriority.HIGH > EventPriority.NORMAL);
		assert(Number.isInteger(EventPriority.HIGHER) && EventPriority.HIGHER > EventPriority.HIGH);
		assert(Number.isInteger(EventPriority.HIGHEST) && EventPriority.HIGHEST > EventPriority.HIGHER);
	});
});
