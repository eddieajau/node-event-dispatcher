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
var Event = require('app-root-path').require('/lib/Event');

var instance = new Event();

suite('Event', function () {

	test('should be able to set the propagation state', function () {
		assert.equal(instance.isPropagationStopped(), false, 'the default propagation should be not stopped');
		instance.stopPropagation();
		assert.equal(instance.isPropagationStopped(), true, 'the propagation should be stopped');
	});

});
