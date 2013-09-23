/* global define */
'use strict';

define(function () {
    var config = {};

    config.viewport = {
        width: 600,
        height: 800
    };

    config.ship = {
        width: 99,
        height: 75,
        assets: {
            default: 'image(images/player.png)',
            left: 'image(images/playerLeft.png)',
            right: 'image(images/playerRight.png)'
        },
        lastPosition: {
            x: -38,
            y: config.viewport.height / 2 - 90
        },
        speed: {
            x: 0,
            y: 0,
            acc: 10
        },
        bulletAcc: 20,
        lives: 3
    };

    config.bullet = {
        width: 9,
        height: 33,
        asset: 'image(images/laserRed.png)',
        acc: 20
    };

    config.asteroid = {
        width: 44,
        height: 42,
        asset: 'image(images/meteorSmall.png)',
        top: -config.viewport.height / 2 - 20,
        spacing: 15
    };

    config.ui = {
        life: {
            width: 35,
            height: 27,
            asset: 'image(images/life.png)',
            y: 20,
            x: 20
        }
    };

    return config;
});
