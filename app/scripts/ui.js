/* global define, Engine */
'use strict';

define(['config', 'game', 'scene'], function (config, game, scene) {
    var ui = {};

    ui.init = function (shipColor) {
        this.shipColor = shipColor;
        this.livesIcons = [];
        this.livesLeft = config.ship.lives;
        this.score = 0;
        this.updateScore(0);
        this.drawLives();

        if (!this.eventsBound) { this.bindEvents(); }
    };

    ui.bindEvents = function () {
        var _this = this;

        this.eventsBound = true;

        game.on('shipDestroyed', function () {
            if (this.livesLeft) {
                _this.drawLives();
            } else {
                // Force to remove last life from UI when it was the last one
                _this.livesIcons.pop().destroy();
            }
        });

        game.on('updateScore', function (points) {
            _this.updateScore(points);
        });

        game.on('gameover', function () {
            _this.updateScoreboard();
        });
    };

    ui.drawLives = function () {
        var _this = this;

        while (this.livesIcons.length) {
            // Remove all current icons before rendering new one
            this.livesIcons.pop().destroy();
        }

        for (var i = 0; i < this.livesLeft; i++) {
            this.livesIcons.push(
                new Engine.Geometry.Rectangle({
                    parent: scene,
                    width: config.ui.life.width,
                    height: config.ui.life.height,
                    left: -config.viewport.width / 2 + (config.ui.life.x + (i * (config.ui.life.width + 10))),
                    top: -config.viewport.height / 2 +config.ui.life.y,
                    fill: config.ui.life.asset[_this.shipColor]
                })
            );
        }
    };

    ui.updateScore = function (points) {
        // Update score counter visible to user
        document.querySelector('.score').innerText = this.score += points;
    };

    // Simple high-scores list based on localStorage
    ui.updateScoreboard = function () {
        if (!window.localStorage) { return; }

        var key = 'scores';
        var currentScore = this.score;
        var scores = localStorage.getItem(key) ? localStorage.getItem(key).split(',').map(function (n) { return parseInt(n, 10); }) : [];

        scores.push(currentScore);

        scores.sort(function (a, b) {
            return b - a;
        });

        scores = scores.splice(0, 5);

        localStorage.setItem(key, scores);

        var scoresList = document.querySelector('.scores');

        scoresList.innerHTML = '';
        scores.forEach(function (score) {
            if (score === currentScore) {
                scoresList.innerHTML += '<li class="current"><span>' + score + '</span></li>';
            } else {
                scoresList.innerHTML += '<li><span>' + score + '</span></li>';
            }
        });
    };

    return ui;
});
