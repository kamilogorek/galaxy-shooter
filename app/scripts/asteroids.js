/* global define, Engine, log */
'use strict';

define(['config', 'game', 'scene', 'viewport', 'sounds'], function (config, game, scene, viewport, sounds) {
    var asteroids = {};

    asteroids.instances = [];

    asteroids.init = function () {
        while (this.instances.length) {
            this.instances.pop().destroy();
        }

        this.minNumber = config.asteroid.minNumber;
        this.maxNumber = config.asteroid.maxNumber;

        // Random number between min and max
        this.generateAsteroids(Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1)) + this.minNumber);

        if (!this.eventsBound) {
            this.bindEvents();
        }
    };

    asteroids.generateAsteroids = function (asteroidsNumber, replicate) {
        // TODO Spin asteroids

        for (var i = 0; i < asteroidsNumber; i++) {
            var size;
            var leftPos;
            var topPos;
            var acc;

            if (replicate) {
                size = 'small';
                // center of the old asteroid
                leftPos = replicate.left + replicate.width / 2;
                // spread replicated asteroids evenly from left to right
                leftPos += (-Math.round(asteroidsNumber / 2) + i + 1) * (config.asteroid[size].width);
                topPos = replicate.top + replicate.height;
                acc = replicate.acc + Math.random() * 3 + 1;
                // TODO use profiler
            } else {
                // Chance of generating big asteroid
                size = Math.random() < config.asteroid.chance ? 'big' : 'small';
                leftPos = Math.random() * config.viewport.width - config.viewport.width / 2 + config.asteroid.spacing;
                topPos = config.asteroid.top;
                acc = Math.random() * (5 - 2 + 1) + 2;
            }

            // if it overflows on the right side, add difference + spacing
            if (leftPos + config.asteroid[size].width + config.asteroid.spacing > viewport.width / 2) {
                var diff = leftPos + config.asteroid[size].width - viewport.width / 2;
                leftPos = leftPos - diff - config.asteroid.spacing;
            }

            var asteroid = new Engine.Geometry.Rectangle({
                parent: scene,
                fill: config.asteroid[size].asset,
                left: leftPos,
                top: topPos,
                width: config.asteroid[size].width,
                height: config.asteroid[size].height
            });

            // Random float number between 2 and 5
            asteroid.acc = acc;
            asteroid.size = size;

            this.instances.push(asteroid);
        }

        log('Asteroids:', this.instances);
    };

    // TODO: Add scoreboard

    asteroids.checkOverflow = function (asteroid) {
        if (asteroid.top > config.viewport.height / 2) {
            this.instances.remove(asteroid);
            asteroid.destroy();
        }
    };

    asteroids.bindEvents = function () {
        var _this = this;
        var generateCounter = 0;
        var difficultyCounter = 0;

        this.eventsBound = true;

        game.on('loop', function () {
            (function generateAsteroidsLoop () {
                // Generate only every config.asteroid.generateDelay loop
                if (++generateCounter !== config.asteroid.generateDelay) { return; }
                // Reset step counter
                generateCounter = 0;

                // Random number between min and max
                _this.generateAsteroids(Math.floor(Math.random() * (_this.maxNumber - _this.minNumber + 1)) + _this.minNumber);
            })();

            (function generateAsteroidsLoop () {
                if (++difficultyCounter !== config.asteroid.changeDifficultyDelay) { return; }
                // Reset step counter
                difficultyCounter = 0;

                if (Math.random() > 0.5) {
                    _this.minNumber++;
                    log('Increased min number');
                } else {
                    _this.maxNumber++;
                    log('Increased max number');
                }
            })();
        });

        game.on('step', function () {
            _this.instances.some(function (asteroid) {
                asteroid.setPosition(asteroid.left, asteroid.top + asteroid.acc);
                // Remove meteor if it's not visible
                _this.checkOverflow(asteroid);
            });
        });

        game.on('asteroidDestroyed', function (asteroid) {
            sounds.asteroidDestroyed.stop();
            sounds.asteroidDestroyed.play();

            new Engine.Particles({
                parent: scene,
                iterations: 10,
                emitDelay: 0,
                width: asteroid.width,
                height: asteroid.height,
                left: asteroid.left,
                top: asteroid.top,
                amount: 15,
                fill: 'rgb(152, 112, 87) 3px 3px',
                originX: asteroid.width / 2,
                originY: asteroid.height / 2,
                on: {
                    beforecreateparticle: function() {
                        this.lifetime = Math.random() * 2000;
                        this.dx = Math.random() * asteroid.width * 10;
                        this.dy = Math.random() * asteroid.height * 10;
                    }
                }
            });

            if (asteroid.size === 'big') {
                _this.generateAsteroids(config.asteroid.replicateNumber, asteroid);
            }
        });

        game.on('asteroidOverflow', function (asteroid) {
            asteroid.destroy();
        });
    };

    // TODO: Add super powers (tripple shot, fast shot, bomb)

    return asteroids;
});
