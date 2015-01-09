# helix-loop

Simple game loop management

## Installation

`npm install helix-loop`

## Usage

```javascript
var helix = new (require('helix-loop'))({
    updateInterval: 1000 / 60  // 60 fps, about 16 ms per tick
});

helix.on('start', function () {
    // setup that happens once, before the first update tick
});

helix.on('preUpdate', function () {
    // stuff that should happen in preparation for update to be called one or more times this frame
});

helix.on('update', function (dt) {
    // world simulation, can run multiple times per frame
});

helix.on('postUpdate', function () {
    // stuff that should happen after the world is completely simulated this frame
});

helix.on('render', function (t) {
    // called once per frame
});

helix.on('stop', function () {
    // teardown that happens when the loop is stopped
});

helix.start();
// helix.isRunning = true;

helix.pause();
// helix.isRunning = false;

helix.start();
// helix.isRunning = true;
// doesn't fire 'start' event again unless stop is called

helix.stop();
// helix.isRunning = false;
```
