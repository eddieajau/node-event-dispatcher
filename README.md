[![Build Status](https://travis-ci.org/eddieajau/node-event-dispatcher.svg?branch=master)](https://travis-ci.org/eddieajau/node-config-factory)
[![Dependency Status](https://david-dm.org/eddieajau/node-event-dispatcher.svg)](https://david-dm.org/eddieajau/node-event-dispatcher)

# event-dispatcher

Many variations of event dispatchers exist for Node. Node even includes its own. However, none of them provide any sort of callback for when the listeners have all finished. This is what makes this package different.

## Installation

```sh
$ npm install @eddieajau/event-dispatcher
```

## Example

```js
var EventDispatcher = require('@eddieajau/event-dispatcher');
var Event = EventDispatcher.Event;

var dispatcher = new EventDispatcher();

dispatcher.addListener('an-event', function listener1(event, next) {
  event.foo = 'bar';
  next();
});

dispatcher.dispatch('an-event')
  .then(function (event) {
    console.log(event.foo);
  });
```

## Code quality and tests

```sh
$ npm run lint
$ npm run test
```

## API
<a name="EventDispatcher"></a>
### EventDispatcher
**Kind**: global class  
**See**: [https://github.com/symfony/EventDispatcher/blob/master/EventDispatcherInterface.php](https://github.com/symfony/EventDispatcher/blob/master/EventDispatcherInterface.php)  

* [EventDispatcher](#EventDispatcher)
  * [new EventDispatcher()](#new_EventDispatcher_new)
  * _instance_
    * [.addListener(eventName, callback, [priority])](#EventDispatcher+addListener) ⇒ <code>[EventDispatcher](#EventDispatcher)</code>
    * [.getListeners(eventName)](#EventDispatcher+getListeners) ⇒ <code>Array.&lt;function()&gt;</code>
    * [.dispatch(eventName, [event])](#EventDispatcher+dispatch) ⇒ <code>[Event](#Event)</code>
  * _static_
    * [.Event](#EventDispatcher.Event) : <code>[Event](#Event)</code>

<a name="new_EventDispatcher_new"></a>
#### new EventDispatcher()
A class to manage dispatching events and resolving when they are all complete.

<a name="EventDispatcher+addListener"></a>
#### eventDispatcher.addListener(eventName, callback, [priority]) ⇒ <code>[EventDispatcher](#EventDispatcher)</code>
Adds an event listener that listens on the specified events.

**Kind**: instance method of <code>[EventDispatcher](#EventDispatcher)</code>  
**Returns**: <code>[EventDispatcher](#EventDispatcher)</code> - The dispatcher so calls can be chained.  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | The name of the event to listen on. |
| callback | <code>function</code> | The listener callback |
| [priority] | <code>integer</code> | The higher this value, the earlier an event                               listener will be triggered in the chain (defaults to 0) |

<a name="EventDispatcher+getListeners"></a>
#### eventDispatcher.getListeners(eventName) ⇒ <code>Array.&lt;function()&gt;</code>
Gets the listeners of a specific event.

**Kind**: instance method of <code>[EventDispatcher](#EventDispatcher)</code>  
**Returns**: <code>Array.&lt;function()&gt;</code> - - An array of function listeners (to call).  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | The name of the event. |

<a name="EventDispatcher+dispatch"></a>
#### eventDispatcher.dispatch(eventName, [event]) ⇒ <code>[Event](#Event)</code>
Dispatches an event to all registered listeners.

**Kind**: instance method of <code>[EventDispatcher](#EventDispatcher)</code>  
**Returns**: <code>[Event](#Event)</code> - The original event is returned back. It may, however, have been modified by the event listeners.  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | The name of the event to dispatch. |
| [event] | <code>[Event](#Event)</code> | The event to pass to the event handlers/listeners.                             If not supplied, an empty Event instance is created. |

<a name="EventDispatcher.Event"></a>
#### EventDispatcher.Event : <code>[Event](#Event)</code>
**Kind**: static property of <code>[EventDispatcher](#EventDispatcher)</code>  

<a name="Event"></a>
### Event
**Kind**: global class  
**See**: Based on [https://github.com/symfony/EventDispatcher/blob/master/Event.php](https://github.com/symfony/EventDispatcher/blob/master/Event.php)  

* [Event](#Event)
  * [new Event()](#new_Event_new)
  * [.isPropagationStopped()](#Event+isPropagationStopped) ⇒ <code>boolean</code>
  * [.stopPropagation()](#Event+stopPropagation)

<a name="new_Event_new"></a>
#### new Event()
Base event class.

This class contains no event data. It is used by events that do not pass
state information to an event handler when an event is raised.

<a name="Event+isPropagationStopped"></a>
#### event.isPropagationStopped() ⇒ <code>boolean</code>
Returns whether event listeners should be triggered.

**Kind**: instance method of <code>[Event](#Event)</code>  
**Returns**: <code>boolean</code> - Whether propagation was already stopped for this event.  
<a name="Event+stopPropagation"></a>
#### event.stopPropagation()
Stops the propagation of the event to further event listeners.

If multiple event listeners are connected to the same event, no
further event listener will be triggered once any trigger calls
stopPropagation().

**Kind**: instance method of <code>[Event](#Event)</code>  

## License

MIT

## References
* http://keepachangelog.com
* https://github.com/jsdoc2md/jsdoc-to-markdown
* http://sinonjs.org/docs/#spies
* Inspired by
  - [Hoopla](https://github.com/justinhoward/hoopla) by [Justin Howard](https://github.com/justinhoward).
  - Symfony ([EventDispatcherInterface](https://github.com/symfony/EventDispatcher/blob/master/EventDispatcherInterface.php))

* * *

&copy; 2015 Andrew Eddie. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
