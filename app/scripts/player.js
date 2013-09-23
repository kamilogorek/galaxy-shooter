/* global define, Engine */
'use strict';

define(['config', 'game', 'scene', 'viewport', 'asteroids', 'sounds'], function (config, game, scene, viewport, asteroids, sounds) {
    var player = {};
    // TODO: Add mouse support

    // TODO: Lighter color to particles after destroying ship

    player.init = function () {
        this.bullets = [];
        this.create();
        this.bindEvents();
        this.bindKeys();
    };

    player.create = function () {
        // Restart speed - key persistent bug
        config.ship.speed.x = 0;
        config.ship.speed.y = 0;
        game.trigger('stopShooting');

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
            duration: 150,
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

    player.checkBulletOverflow = function (bullet) {
        if (bullet.top < -config.viewport.height / 2) {
            this.bullets.remove(bullet);
            bullet.destroy();
        }
    };

    player.bulletAsteroidCollision = function (bullet, asteroid) {
        if (Engine.Box.overlap(asteroid.left, asteroid.top, asteroid.width, asteroid.height,
            bullet.left, bullet.top, bullet.width, bullet.height)) {

            this.bullets.remove(bullet);
            bullet.destroy();

            asteroids.instances.remove(asteroid);
            asteroid.destroy();

            game.trigger('asteroidDestroyed', asteroid);

            // TODO: Add score depending on speed? size?
            game.trigger('updateScore', 200);
        }
    };

    player.playerAsteroidCollision = function (asteroid) {
        if (scene.ship === undefined) return;
        if (scene.ship.invincible) return;

        if (Engine.Box.overlap(asteroid.left, asteroid.top, asteroid.width, asteroid.height,
            scene.ship.left, scene.ship.top, scene.ship.width, scene.ship.height)){
            // TODO: Add particles on game over

            config.ship.lastPosition = {
                x: scene.ship.left,
                y: scene.ship.top
            };

            game.trigger('shipDestroyed', scene.ship);
        }
    };

    player.bindEvents = function () {
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

                asteroids.instances.some(function (asteroid) {
                    _this.bulletAsteroidCollision(bullet, asteroid);
                });

                _this.checkBulletOverflow(bullet);
            });
        });

        game.on('step', function () {
            asteroids.instances.some(function (asteroid) {
                _this.playerAsteroidCollision(asteroid);
            });
        });

        game.on('startShooting', function () {
            // Ignore first delay and shoot immediatelly
            _this.generateBullet();

            _this.shootingInterval = setInterval(function () {
                _this.generateBullet();
            }, 200);
        });

        game.on('stopShooting', function () {
            clearInterval(_this.shootingInterval);
        });

        game.on('shipDestroyed', function (ship) {
            config.ship.lives -= 1;
            ship.destroy();

            new Engine.Particles({
                parent: scene,
                iterations: 10,
                emitDelay: 0,
                width: ship.width,
                height: ship.height,
                left: ship.left,
                top: ship.top,
                amount: 20,
                fill: 'rgb(168, 23, 23) 3px 3px',
                originX: ship.width / 2,
                originY: ship.height / 2,
                lifetime: 5000,
                on: {
                    beforecreateparticle: function() {
                        this.dx = Math.random() * ship.width * 1000;
                        this.dy = Math.random() * ship.height * 1000;
                    }
                }
            });

            if (config.ship.lives) {
                setTimeout(function () {
                    game.trigger('respawnPlayer');
                }, 2000);
            } else {
                game.trigger('gameover');
            }
        });

        game.on('respawnPlayer', function () {
            _this.create();
        });
    };

    player.generateBullet = function () {
        if (scene.ship === undefined) return;

        var bullet = new Engine.Geometry.Rectangle({
            parent: scene,
            fill: config.bullet.asset,
            left: scene.ship.left + scene.ship.width / 2 - 4,
            top: scene.ship.top - 35,
            width: config.bullet.width,
            height: config.bullet.height
        });

        this.bullets.push(bullet);
        scene.appendChild(bullet);

        sounds.shootBullet.stop();
        sounds.shootBullet.play();
    };

    // TODO: Debug slowness after some time

    player.bindKeys = function () {
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
                game.trigger('startShooting');
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
            case 'SPACE':
                game.trigger('stopShooting');
                break;
            }
        });
    };

    return player;

    // TODO: Remove bower deps from, add it back to ignore and add proper build
});
