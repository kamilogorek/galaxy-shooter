/* global define, Engine */
'use strict';

define(['config', 'game', 'scene', 'viewport', 'asteroids'], function (config, game, scene, viewport, asteroids) {
    var Player = {};
    // TODO: Add sounds
    // TODO: Add mouse support

    Player.init = function () {
        this.bullets = [];
        this.create();
        this.bindEvents();
        this.bindKeys();
    };

    Player.create = function () {
        new Engine.Geometry.Rectangle({
            parent: scene,
            name: 'ship',
            width: config.ship.width,
            height: config.ship.height,
            left: config.ship.lastPosition.x,
            top: config.ship.lastPosition.y,
            fill: config.ship.assets.default
        });

        new Engine.Timer({
            autoplay: true,
            loop: true,
            duration: 200,
            iterations: 10,
            on: {
                play: function () {
                    scene.ship.setOpacity(0);
                    scene.ship.invincible = true;
                },
                loop: function () {
                    if (this.count % 2) {
                        scene.ship.setOpacity(1);
                    } else {
                        scene.ship.setOpacity(0);
                    }
                },
                stop: function () {
                    scene.ship.setOpacity(1);
                    scene.ship.invincible = false;
                }
            }
        });
    };

    Player.bulletAsteroidCollision = function (bullet, asteroid) {
        if (Engine.Box.overlap(asteroid.left, asteroid.top, asteroid.width, asteroid.height,
            bullet.left, bullet.top, bullet.width, bullet.height)){

            this.bullets.remove(bullet);
            bullet.destroy();

            asteroids.remove(asteroid);
            asteroid.destroy();

            game.trigger('asteroidDestroyed', asteroid);

            // TODO: Add score depending on speed? size?
            game.trigger('updateScore', 200);
        }
    };

    Player.playerAsteroidCollision = function (asteroid) {
        if (scene.ship === undefined) return;
        if (scene.ship.invincible) return;

        if (Engine.Box.overlap(asteroid.left, asteroid.top, asteroid.width, asteroid.height,
            scene.ship.left, scene.ship.top, scene.ship.width, scene.ship.height)){
            // TODO: Add particles on game over

            config.ship.lastPosition = {
                x: scene.ship.left,
                y: scene.ship.top
            };

            game.trigger('shipDestroyed');
        }
    };

    Player.bindEvents = function () {
        var _this = this;

        game.on('step', function () {
            if (scene.ship === undefined) return;

            var leftBorder = scene.ship.left + viewport.width / 2 < 0;
            var rightBorder = scene.ship.left + scene.ship.width + viewport.width/2 > viewport.width;
            var topBorder = scene.ship.top + viewport.height / 2 < 0;
            var bottomBorder = scene.ship.top + scene.ship.height + viewport.height/2 > viewport.height;

            // TODO: Find better solution
            if (leftBorder) {
                scene.ship.setPosition(++scene.ship.left, scene.ship.top);
            } else if (rightBorder) {
                scene.ship.setPosition(--scene.ship.left, scene.ship.top);
            } else if (topBorder) {
                scene.ship.setPosition(scene.ship.left, ++scene.ship.top);
            } else if (bottomBorder) {
                scene.ship.setPosition(scene.ship.left, --scene.ship.top);
            } else {
                scene.ship.setPosition(scene.ship.left + config.ship.speed.x, scene.ship.top + config.ship.speed.y);
            }
        });

        game.on('step', function () {
            _this.bullets.some(function (bullet) {
                bullet.setPosition(bullet.left, bullet.top - config.bullet.acc);

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
            var bullet = new Engine.Geometry.Rectangle({
                parent: scene,
                fill: config.bullet.asset,
                left: scene.ship.left + scene.ship.width / 2 - 4,
                top: scene.ship.top - 35,
                width: config.bullet.width,
                height: config.bullet.height
            });

            _this.bullets.push(bullet);
            scene.appendChild(bullet);
        });
    };

    Player.bindKeys = function () {
        Engine.Input.on('keydown', function (e) {
            if (scene.ship === undefined) return;

            switch (e.key) {
            case 'ARROW_LEFT':
                config.ship.speed.x -= config.ship.speed.acc;
                scene.ship.setImage(config.ship.assets.left);
                break;
            case 'ARROW_RIGHT':
                config.ship.speed.x += config.ship.speed.acc;
                scene.ship.setImage(config.ship.assets.right);
                break;
            case 'ARROW_UP':
                config.ship.speed.y -= config.ship.speed.acc;
                break;
            case 'ARROW_DOWN':
                config.ship.speed.y += config.ship.speed.acc;
                break;
            case 'SPACE':
                game.trigger('shoot');
                break;
            }
        });

        Engine.Input.on('keyup', function (e) {
            if (scene.ship === undefined) return;

            switch (e.key) {
            case 'ARROW_LEFT':
                config.ship.speed.x += config.ship.speed.acc;
                scene.ship.setImage(config.ship.assets.default);
                break;
            case 'ARROW_RIGHT':
                config.ship.speed.x -= config.ship.speed.acc;
                scene.ship.setImage(config.ship.assets.default);
                break;
            case 'ARROW_UP':
                config.ship.speed.y += config.ship.speed.acc;
                break;
            case 'ARROW_DOWN':
                config.ship.speed.y -= config.ship.speed.acc;
                break;
            }
        });
    };

    return Player;

    // TODO: Remove bower deps from, add it back to ignore and add proper build
});
