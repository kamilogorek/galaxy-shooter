/* global define, Engine */
'use strict';

define(function () {
    return {
        shootBullet: new Engine.Sound({
            src: 'sounds/laser4'
        }),
        pressButton: new Engine.Sound({
            src: 'sounds/switch6'
        })
    };
});
