/* global define, Engine */
'use strict';

define(['game', 'scene', 'viewport', 'layout'], function (game, scene, viewport, layout) {
    var asteroids = [];
    var asteroidAcc = 5;
    var step = 0;

    game.on('loop', function () {
        ++step;
        // TODO: Check progress variable in docs
        if (step === 3) {
            generateAsteroids(Math.round(Math.random() * 5));
            step = 0;
        }
    });

    game.on('asteroidDestroyed', function (asteroid) {
        var brick = {
            left: 50,
            top: 50,
            width: 50,
            height: 50,
            color: 'red'
        }

        console.log(asteroid);

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
            // TODO: Add assets to asteroids
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
                parent: layout,
                fill: 'image(images/meteorSmall.png)',
                left: leftPos,
                top: -viewport.height / 2 - 20,
                width: assetWidth,
                height: 42
            });

            asteroids.push(asteroid);
            scene.appendChild(asteroid);
        }
    }

    generateAsteroids(5);

    game.on('step', function () {
        asteroids.some(function (asteroid) {
            asteroid.setPosition(asteroid.left, asteroid.top + asteroidAcc);
        });
    });

    return asteroids;
});
