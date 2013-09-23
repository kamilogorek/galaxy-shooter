/* global define, Engine */
'use strict';

define(['config', 'game', 'scene', 'viewport'], function (config, game, scene, viewport) {
    var asteroids = {};

    asteroids.init = function () {
        this.instances = [];
        // Random number between 3 and 5
        this.generateAsteroids(Math.floor(Math.random() * (5 - 3 + 1)) + 3);
        this.bindEvents();
    };

    asteroids.generateAsteroids = function (asteroidsNumber) {
        for (var i = 0; i < asteroidsNumber; i++) {
            // TODO Random asteroids size
            // TODO Create small asteroids from a big one
            // TODO Spin asteroids

            var leftPos = Math.random() * config.viewport.width - config.viewport.width / 2 + config.asteroid.spacing;

            // if it overflows on the right side, add difference + spacing
            if (leftPos + config.asteroid.width + config.asteroid.spacing > viewport.width / 2) {
                var diff = leftPos + config.asteroid.width - viewport.width / 2;
                leftPos = leftPos - diff - config.asteroid.spacing;
            }

            var asteroid = new Engine.Geometry.Rectangle({
                parent: scene,
                fill: config.asteroid.asset,
                left: leftPos,
                top: config.asteroid.top,
                width: config.asteroid.width,
                height: config.asteroid.height
            });

            // Random number between 2 and 5
            asteroid.acc = Math.floor(Math.random() * (5 - 2 + 1)) + 2;

            this.instances.push(asteroid);
        }
    };

    asteroids.checkOverflow = function (asteroid) {
        if (asteroid.top > config.viewport.height / 2) {
            this.instances.remove(asteroid);
            asteroid.destroy();
        }
    };

    asteroids.bindEvents = function () {
        var _this = this;

        game.on('step', function () {
            _this.instances.some(function (asteroid) {
                asteroid.setPosition(asteroid.left, asteroid.top + asteroid.acc);
                // Remove meteor if it's not visible
                _this.checkOverflow(asteroid);
            });
        });

        var step = 0;

        game.on('loop', function () {
            ++step;
            // TODO: Check progress variable in docs = FIXIT
            if (step === 3) {
                // Random number between 3 and 5
                _this.generateAsteroids(Math.floor(Math.random() * (5 - 3 + 1)) + 3);
                step = 0;
            }
        });

        // TODO: Increase min and max on timeInterval

        game.on('asteroidDestroyed', function (asteroid) {
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
        });

        game.on('asteroidOverflow', function (asteroid) {
            asteroid.destroy();
        });
    }

    // TODO: Add super powers (tripple shot, fast shot, bomb)

    return asteroids;
});
