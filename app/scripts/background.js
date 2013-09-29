/* global define, Engine */
'use strict';

define(['config', 'game', 'scene'], function (config, game, scene) {
    var background = {};

    background.init = function () {
        var _this = this;

        this.sparkles = [];
        this.generateSparkles();

        game.on('step', function () {
            for (var i = 0; i < config.background.animationCount; i++) {
                _this.sparkles[Math.floor(Math.random() * config.background.count)].setOpacity(Math.random());
            }
        });
    };

    background.generateSparkle = function () {
        this.sparkles.push(
            new Engine.Geometry.Rectangle({
                parent: scene,
                width: config.background.width,
                height: config.background.height,
                left: Math.round(Math.random() *  config.viewport.width) - config.viewport.width / 2,
                top: Math.round(Math.random() * config.viewport.height) - config.viewport.height / 2,
                fill: config.background.color,
                opacity: Math.random()
            })
        );
    };

    background.generateSparkles = function () {
        for (var i = 0; i < config.background.count; i++) {
            this.generateSparkle();
        }
    };

    return background;
});
