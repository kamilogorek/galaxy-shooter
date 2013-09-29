/* global define, Engine */
'use strict';

define(function () {
    return {
        shootBullet: new Engine.Sound({
            src: 'sounds/laser4'
        }),

        pressButton: new Engine.Sound({
            src: 'sounds/switch6'
        }),

        shipDestroyed: new Engine.Sound({
            src: 'sounds/spaceTrash2'
        }),

        shipCreated: new Engine.Sound({
            src: 'sounds/threeTone2'
        }),

        asteroidDestroyed: new Engine.Sound({
            src: 'sounds/tone1'
        })
    };
});
