/* global define, Engine */
'use strict';

define(['scene'], function (scene) {
    return new Engine.Camera({
        lookAt: scene
    });
});
