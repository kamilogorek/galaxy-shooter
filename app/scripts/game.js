/* global define, Engine */
'use strict';

define(function () {
    return new Engine.Timer({
        type: Engine.Timer.VSYNC,
        loop: true,
        autoplay: true
    });
});
