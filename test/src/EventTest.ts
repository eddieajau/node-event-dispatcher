/**
 * Event tests.
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

import * as assert from "assert";
import {Event} from "../../src/Event";

suite('Event', function () {

	test('should be able to set the propagation state', function () {
		var instance = new Event()

		assert.equal(instance.isPropagationStopped(), false, 'the default propagation should be not stopped');
		instance.stopPropagation();
		assert.equal(instance.isPropagationStopped(), true, 'the propagation should be stopped');
	});

});
