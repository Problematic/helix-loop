var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

function Helix (options) {
    EventEmitter.call(this);

    this.options = {
        updateInterval: 1000 / 60,
        lagCap: 1000
    };
    for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
            this.options[prop] = options[prop];
        }
    }

    this._firstPass = true;
    this.isRunning = false;
    this.tick = 0;
    this.last = null;
    this.lag = 0;
    this.gameAnimationFrame = null;
}

inherits(Helix, EventEmitter);

Helix.prototype.start = function () {
    this.isRunning = true;
    this.last = Date.now();

    if (this._firstPass) {
        this.emit('start');
        this._firstPass = false;
    }

    this.gameAnimationFrame = window.requestAnimationFrame(this._loop.bind(this));
};

Helix.prototype.stop = function () {
    this.isRunning = false;
    this.tick = 0;
    this.lag = 0;
    this._firstPass = true;
    window.cancelAnimationFrame(this.gameAnimationFrame);
};

Helix.prototype.pause = function () {
    this.isRunning = false;
    window.cancelAnimationFrame(this.gameAnimationFrame);
};

Helix.prototype._loop = function () {
    this.gameAnimationFrame = window.requestAnimationFrame(this._loop.bind(this));

    var current = Date.now();
    var delta = current - this.last;
    this.last = current;
    this.lag += delta;

    var lagCap = this.options.lagCap;
    if (lagCap && this.lag > lagCap) {
        this.lag = lagCap;
    }

    this.emit('preUpdate', delta);
    var updateInterval = this.options.updateInterval;
    while (this.lag >= updateInterval) {
        this.tick++;
        this.emit('update', updateInterval / 1000);
        this.lag -= updateInterval;
    }
    this.emit('postUpdate', delta);

    this.emit('render', this.lag / updateInterval);
};

module.exports = Helix;
