/* global define, Engine */
'use strict';

define(['scene'], function (scene) {
    var camera = new Engine.Camera({
        lookAt: scene
    });

    return camera;
});
