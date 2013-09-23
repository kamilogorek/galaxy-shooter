/* global define, Engine */
'use strict';

define(['game', 'scene', 'viewport'], function (game, scene, viewport) {
    var asteroids = [];
    var step = 0;

    game.on('loop', function () {
        ++step;
        // TODO: Check progress variable in docs
        if (step === 3) {
            // Random number between 3 and 5
            generateAsteroids(Math.floor(Math.random() * (5 - 3 + 1)) + 3);
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
                beforecreateparticle: function(i){
                    this.lifetime = Math.random() * 2000;
                    this.dx = Math.random() * asteroid.width * 10;
                    this.dy = Math.random() * asteroid.height * 10;
                }
            }
        });
    });

    function generateAsteroids (asteroidsNumber) {
        var assetWidth = 44;
        var spacing = 15;

        for (var i = 0; i < asteroidsNumber; i++) {
            // Random asteroids speed
            // Random asteroids size
            // Create small asteroids from a big one
            // Spin asteroids

            var leftPos = Math.random() * viewport.width - viewport.width / 2 + spacing;

            // if it overflows on the right side, add difference + spacing
            if (leftPos + assetWidth + spacing > viewport.width / 2) {
                var diff = leftPos + assetWidth - viewport.width / 2;
                leftPos = leftPos - diff - spacing;
            }

            var asteroid = new Engine.Geometry.Rectangle({
                parent: scene,
                fill: 'image(images/meteorSmall.png)',
                left: leftPos,
                top: -viewport.height / 2 - 20,
                width: assetWidth,
                height: 42,
            });

            // Random number between 2 and 5
            asteroid.acc = Math.floor(Math.random() * (5 - 2 + 1)) + 2;

            asteroids.push(asteroid);
        }
    }

    // Random number between 3 and 5
    generateAsteroids(Math.floor(Math.random() * (5 - 3 + 1)) + 3);

    game.on('step', function () {
        asteroids.some(function (asteroid) {
            asteroid.setPosition(asteroid.left, asteroid.top + asteroid.acc);
        });
    });

    // TODO: Add super powers (tripple shot, fast shot, bomb)

    return asteroids;
});
