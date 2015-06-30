# Node.js Event Dispatcher

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
{{#class name="EventDispatcher"}}{{>docs}}{{/class}}
{{#class name="Event"}}{{>docs}}{{/class}}
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
