/* global define, Engine */
'use strict';

define(['config', 'camera'], function (config, camera) {
    return new Engine.Viewport({
        width: config.viewport.width,
        height: config.viewport.height,
        background: config.viewport.background,
        id: 'game',
        cameras: [camera]
    });
});
