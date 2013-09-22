/* global define, Engine */
'use strict';

define(function () {
    var game = new Engine.Timer({
        type: Engine.Timer.VSYNC,
        loop: true,
        autoplay: true
    });

    return game;
});
