/* global define, Engine */
'use strict';

define(['camera'], function (camera) {
    var viewport = new Engine.Viewport({
        width: 600,
        height: 800,
        background: 'black',
        id: 'game',
        cameras: [camera]
    });

    return viewport;
});
