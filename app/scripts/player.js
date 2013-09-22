/* global define, Engine */
'use strict';

define(['game', 'scene', 'viewport', 'layout', 'asteroids'], function (game, scene, viewport, layout, asteroids) {
    var Player = {};
    // TODO: Add sounds
    // TODO: Move stuff to config module
    Player.speed = {
        x: 0,
        y: 0,
        acc: 10,
        bulletAcc: 20
    };

    Player.init = function () {
        Player.create();
        Player.bindEvents();
        Player.bindKeys();
    };

    Player.create = function () {
        scene.appendChild(
            new Engine.Geometry.Rectangle({
                name: 'ship',
                width: 99,
                height: 75,
                left: -38,
                top: viewport.height / 2 - 90,
                fill: 'image(images/player.png)'
            })
        );

        // Basic respawn animation

        // TODO: Check if ship is visible, if not, set js timer
        setTimeout(function () { scene.ship.setOpacity(0); }, 100);
        setTimeout(function () { scene.ship.setOpacity(1); }, 200);
        setTimeout(function () { scene.ship.setOpacity(0); }, 300);
        setTimeout(function () { scene.ship.setOpacity(1); }, 400);
        setTimeout(function () { scene.ship.setOpacity(0); }, 500);
        setTimeout(function () { scene.ship.setOpacity(1); }, 600);

        this.bullets = [];
    };

    Player.bulletAsteroidCollision = function (bullet, asteroid) {
        if (Engine.Box.overlap(asteroid.left, asteroid.top, asteroid.width, asteroid.height,
            bullet.left, bullet.top, bullet.width, bullet.height)){

            this.bullets.remove(bullet);
            bullet.destroy();
            asteroids.remove(asteroid);
            asteroid.destroy();

            game.trigger('asteroidDestroyed', asteroid);

            return true;
        }

        return false;
    };

    Player.playerAsteroidCollision = function (asteroid) {
        if (scene.ship === undefined) { return; }

        if (Engine.Box.overlap(asteroid.left, asteroid.top, asteroid.width, asteroid.height,
            scene.ship.left, scene.ship.top, scene.ship.width, scene.ship.height)){
            // TODO: Add particles on game over
            game.trigger('gameover');

            return true;
        }

        return false;
    };

    Player.bindEvents = function () {
        var _this = this;

        game.on('step', function () {
            if (scene.ship === undefined) { return; }

            var leftBorder = scene.ship.left + viewport.width / 2 < 0;
            var rightBorder = scene.ship.left + scene.ship.width + viewport.width/2 > viewport.width;
            var topBorder = scene.ship.top + viewport.height / 2 < 0;
            var bottomBorder = scene.ship.top + scene.ship.height + viewport.height/2 > viewport.height;

            if (leftBorder) {
                scene.ship.setPosition(++scene.ship.left, scene.ship.top);
            } else if (rightBorder) {
                scene.ship.setPosition(--scene.ship.left, scene.ship.top);
            } else if (topBorder) {
                scene.ship.setPosition(scene.ship.left, ++scene.ship.top);
            } else if (bottomBorder) {
                scene.ship.setPosition(scene.ship.left, --scene.ship.top);
            } else {
                scene.ship.setPosition(scene.ship.left + _this.speed.x, scene.ship.top + _this.speed.y);
            }
        });

        game.on('step', function () {
            _this.bullets.some(function (bullet) {
                bullet.setPosition(bullet.left, bullet.top - _this.speed.bulletAcc);

                asteroids.some(function (asteroid) {
                    _this.bulletAsteroidCollision(bullet, asteroid);
                });
            });
        });

        game.on('step', function () {
            asteroids.some(function (asteroid) {
                _this.playerAsteroidCollision(asteroid);
            });
        });

        game.on('shoot', function () {
            var bullets = new Engine.Geometry.Rectangle({
                parent: layout,
                fill: 'image(images/laserRed.png)',
                left: scene.ship.left + scene.ship.width / 2 - 4,
                top: scene.ship.top - 35,
                width: 9,
                height: 33
            });

            _this.bullets.push(bullets);
            scene.appendChild(bullets);
        });

        game.on('gameover', function () {
            console.log('GAME OVER!');

            // TODO: Generate sparkles

            scene.ship.destroy();
        });
    };

    Player.bindKeys = function () {
        var _this = this;

        // TODO: Reset buttons
        Engine.Input.on('keydown', function (e) {
            if (scene.ship === undefined) { return; }

            switch (e.key) {
            case 'ARROW_LEFT':
                _this.speed.x -= _this.speed.acc;
                scene.ship.setImage('image(images/playerLeft.png)');
                break;
            case 'ARROW_RIGHT':
                _this.speed.x += _this.speed.acc;
                scene.ship.setImage('image(images/playerRight.png)');
                break;
            case 'ARROW_UP':
                _this.speed.y -= _this.speed.acc;
                break;
            case 'ARROW_DOWN':
                _this.speed.y += _this.speed.acc;
                break;
            case 'SPACE':
                game.trigger('shoot');
                break;
            }
        });

        Engine.Input.on('keyup', function (e) {
            if (scene.ship === undefined) { return; }

            switch (e.key) {
            case 'ARROW_LEFT':
                _this.speed.x += _this.speed.acc;
                scene.ship.setImage('image(images/player.png)');
                break;
            case 'ARROW_RIGHT':
                _this.speed.x -= _this.speed.acc;
                scene.ship.setImage('image(images/player.png)');
                break;
            case 'ARROW_UP':
                _this.speed.y += _this.speed.acc;
                break;
            case 'ARROW_DOWN':
                _this.speed.y -= _this.speed.acc;
                break;
            }
        });
    };

    return Player;
});
