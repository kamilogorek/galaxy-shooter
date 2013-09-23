/* global define, Engine */
'use strict';

define(['config', 'game', 'scene', 'player'], function (config, game, scene, player) {
    var ui = {};

    ui.init = function () {
        this.lives = [];
        this.score = 0;
        this.drawLives();
        this.bindEvents();
    };

    ui.bindEvents = function () {
        var _this = this;

        game.on('shipDestroyed', function () {
            --config.ship.lives;
            scene.ship.destroy();

            if (config.ship.lives) {
                player.create();
                _this.drawLives();
            } else {
                game.trigger('gameover');
            }
        });

        game.on('updateScore', function (points) {
            _this.updateScore(points);
        });
    };

    ui.drawLives = function () {
        while (this.lives.length) {
            this.lives.pop().destroy();
        }

        for (var i = 0; i < config.ship.lives; i++) {
            this.lives.push(new Engine.Geometry.Rectangle({
                parent: scene,
                width: config.ui.life.width,
                height: config.ui.life.height,
                left: -config.viewport.width / 2 + (config.ui.life.x + (i * (config.ui.life.width + 10))),
                top: -config.viewport.height / 2 +config.ui.life.y,
                fill: config.ui.life.asset
            }));
        }
    };

    ui.updateScore = function (points) {
        var counter = document.querySelector('#score');

        this.score += points;

        counter.innerText = this.score;
    };

    return ui;
});
