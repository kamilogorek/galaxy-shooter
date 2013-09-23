/* global define, Engine */
'use strict';

define(['config', 'game', 'scene'], function (config, game, scene) {
    var ui = {};

    ui.init = function () {
        this.livesIcons = [];
        this.livesLeft = config.ship.lives;
        this.score = 0;
        this.updateScore(0);
        this.drawLives();

        if (!this.eventsBound) {
            this.bindEvents();
        }
    };

    ui.bindEvents = function () {
        var _this = this;

        this.eventsBound = true;

        game.on('shipDestroyed', function () {
            if (this.livesLeft) {
                _this.drawLives();
            } else {
                // Remove last life from UI
                _this.livesIcons.pop().destroy();
            }
        });

        game.on('updateScore', function (points) {
            _this.updateScore(points);
        });
    };

    ui.drawLives = function () {
        while (this.livesIcons.length) {
            this.livesIcons.pop().destroy();
        }

        for (var i = 0; i < this.livesLeft; i++) {
            this.livesIcons.push(new Engine.Geometry.Rectangle({
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
        var counter = document.querySelector('.score');

        this.score += points;

        counter.innerText = this.score;
    };

    return ui;
});
