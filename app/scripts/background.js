/* global define, Engine */
'use strict';

define(['game', 'scene', 'viewport'], function (game, scene, viewport) {
    var background = {};

    background.sparkles = [];

    background.sparklesNumber = 500;

    background.init = function () {
        var _this = this;

        this.generateSparkles();

        game.on('step', function () {
            for (var i = 0; i < 5; i++) {
                _this.sparkles[Math.floor(Math.random() * _this.sparklesNumber)].setOpacity(Math.random());
            }
        });
    };

    background.generateSparkle = function () {
        var sparkle = new Engine.Geometry.Rectangle({
            width: 2,
            height: 2,
            left: Math.round(Math.random() *  viewport.width) - viewport.width / 2,
            top: Math.round(Math.random() * viewport.height) - viewport.height / 2,
            fill: 'white',
            opacity: Math.random()
        });

        this.sparkles.push(sparkle);
        scene.appendChild(sparkle);
    };

    background.generateSparkles = function () {
        for (var i = 0; i < this.sparklesNumber; i++) {
            this.generateSparkle();
        }
    };

    return background;
});
