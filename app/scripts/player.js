/* global define, Engine */
'use strict';

define(['config', 'game', 'scene', 'viewport', 'ui', 'asteroids', 'sounds'], function (config, game, scene, viewport, ui, asteroids, sounds) {
    var player = {};

    player.init = function (shipColor) {
        this.bullets = [];
        this.shipColor = shipColor;

        // Restart positions
        this.lastPosition = {
            x: config.ship.lastPosition.x,
            y: config.ship.lastPosition.y
        };

        this.create();

        if (!this.eventsBound) { this.bindEvents(); }
        if (!this.keysBound) { this.bindKeys(); }
    };

    player.create = function () {
        sounds.shipCreated.play();

        // Restart speed - key persistance bug (still occurs sometimes...)
        this.speed = {
            x: 0,
            y: 0
        };

        // Remove shooting interval if destroyed thip was shooting
        game.trigger('stopShooting');

        new Engine.Geometry.Rectangle({
            parent: scene,
            name: 'ship',
            width: config.ship[this.shipColor].width,
            height: config.ship[this.shipColor].height,
            left: this.lastPosition.x,
            top: this.lastPosition.y,
            fill: config.ship[this.shipColor].assets.default
        });

        new Engine.Timer({
            autoplay: true,
            loop: true,
            duration: 150,
            iterations: 10,
            on: {
                // Simple blinking animation and protection of newly created ship (1500ms in total)
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
        if (Engine.Box.overlap(asteroid.left, asteroid.top, asteroid.width, asteroid.height, bullet.left, bullet.top, bullet.width, bullet.height)) {
            this.bullets.remove(bullet);
            bullet.destroy();

            asteroids.instances.remove(asteroid);
            asteroid.destroy();

            game.trigger('asteroidDestroyed', asteroid);
            game.trigger('updateScore', parseInt(config.asteroid[asteroid.size].points * asteroid.acc / 2, 10));
        }
    };

    player.playerAsteroidCollision = function (asteroid) {
        if (scene.ship === undefined) { return; }
        if (scene.ship.invincible) { return; }

        if (Engine.Box.overlap(asteroid.left, asteroid.top, asteroid.width, asteroid.height, scene.ship.left, scene.ship.top, scene.ship.width, scene.ship.height)) {
            // Store last position to create new ship in the same place
            this.lastPosition = {
                x: scene.ship.left,
                y: scene.ship.top
            };

            game.trigger('shipDestroyed', scene.ship);
        }
    };

    player.bindEvents = function () {
        var _this = this;

        this.eventsBound = true;

        game.on('step', function () {
            if (scene.ship === undefined) { return; }

            // Dirty screen borders detection
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
            _this.bullets.forEach(function (bullet) {
                bullet.setPosition(bullet.left, bullet.top - config.bullet.acc);

                asteroids.instances.forEach(function (asteroid) {
                    _this.bulletAsteroidCollision(bullet, asteroid);
                });

                _this.checkBulletOverflow(bullet);
            });
        });

        game.on('step', function () {
            asteroids.instances.forEach(function (asteroid) {
                _this.playerAsteroidCollision(asteroid);
            });
        });

        game.on('startShooting', function () {
            // Ignore first delay and shoot immediately
            _this.generateBullet();

            _this.shootingInterval = setInterval(function () {
                _this.generateBullet();
            }, config.bullet.shootingInterval);
        });

        game.on('stopShooting', function () {
            clearInterval(_this.shootingInterval);
        });

        game.on('shipDestroyed', function (ship) {
            sounds.shipDestroyed.play();

            ui.livesLeft -= 1;
            ship.destroy();

            // FIX: Particles are causing really huge performance issues

            // new Engine.Particles({
            //     parent: scene,
            //     iterations: 10,
            //     emitDelay: 0,
            //     width: ship.width,
            //     height: ship.height,
            //     left: ship.left,
            //     top: ship.top,
            //     amount: 20,
            //     fill: config.ship[_this.shipColor].particlesColor,
            //     originX: ship.width / 2,
            //     originY: ship.height / 2,
            //     lifetime: 5000,
            //     on: {
            //         beforecreateparticle: function() {
            //             this.dx = Math.random() * ship.width * 1000;
            //             this.dy = Math.random() * ship.height * 1000;
            //         }
            //     }
            // });

            if (ui.livesLeft) {
                setTimeout(function () {
                    game.trigger('respawnPlayer');
                }, config.ship.respawnDelay);
            } else {
                game.trigger('gameover');
            }
        });

        game.on('respawnPlayer', function () {
            _this.create();
        });
    };

    player.generateBullet = function () {
        if (scene.ship === undefined) { return; }

        var _this = this;
        var bullet = new Engine.Geometry.Rectangle({
            parent: scene,
            fill: config.bullet.asset[_this.shipColor],
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

    player.bindKeys = function () {
        var _this = this;

        this.keysBound = true;

        Engine.Input.on('keydown', function (e) {
            if (scene.ship === undefined) { return; }

            switch (e.key) {
            case config.keys.left:
                _this.speed.x -= config.ship.acc;
                scene.ship.setImage(config.ship[_this.shipColor].assets.left);
                break;
            case config.keys.right:
                _this.speed.x += config.ship.acc;
                scene.ship.setImage(config.ship[_this.shipColor].assets.right);
                break;
            case config.keys.up:
                _this.speed.y -= config.ship.acc;
                break;
            case config.keys.down:
                _this.speed.y += config.ship.acc;
                break;
            case config.keys.shoot:
                game.trigger('startShooting');
                break;
            }
        });

        Engine.Input.on('keyup', function (e) {
            if (scene.ship === undefined) { return; }

            switch (e.key) {
            case config.keys.left:
                _this.speed.x += config.ship.acc;
                scene.ship.setImage(config.ship[_this.shipColor].assets.default);
                break;
            case config.keys.right:
                _this.speed.x -= config.ship.acc;
                scene.ship.setImage(config.ship[_this.shipColor].assets.default);
                break;
            case config.keys.up:
                _this.speed.y += config.ship.acc;
                break;
            case config.keys.down:
                _this.speed.y -= config.ship.acc;
                break;
            case config.keys.shoot:
                game.trigger('stopShooting');
                break;
            }
        });
    };

    return player;
});
