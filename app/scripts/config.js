/* global define */
'use strict';

define(function () {
    var config = {};

    // TODO: Comment code and config

    config.viewport = {
        width: 600,
        height: 800
    };

    config.ship = {
        red: {
            width: 99,
            height: 75,
            assets: {
                default: 'image(images/player-red.png)',
                left: 'image(images/player-red-left.png)',
                right: 'image(images/player-red-right.png)'
            },
            particlesColor: 'rgb(185, 75, 75) 3px 3px'
        },
        green: {
            width: 98,
            height: 50,
            assets: {
                default: 'image(images/player-green.png)',
                left: 'image(images/player-green-left.png)',
                right: 'image(images/player-green-right.png)'
            },
            particlesColor: 'rgb(160, 200, 100) 3px 3px'
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
        asset: {
            red: 'image(images/laser-red.png)',
            green: 'image(images/laser-green.png)'
        },
        acc: 20
    };

    config.asteroid = {
        small: {
            width: 44,
            height: 42,
            asset: 'image(images/meteor-small.png)',
            points: 100
        },
        big: {
            width: 136,
            height: 111,
            asset: 'image(images/meteor-big.png)',
            points: 200
        },
        top: -config.viewport.height / 2 - 20,
        // Screen spacing from left and right side
        spacing: 15,
        minNumber: 3,
        maxNumber: 5,
        // 20% chance of generating big asteroid
        chance: 0.2,
        replicateNumber: 5,
        // Generate new asteroids every 3 seconds
        generateDelay: 3,
        // Increase difficulty every 10 seconds
        changeDifficultyDelay: 10
    };

    config.ui = {
        life: {
            width: 35,
            height: 27,
            asset: {
                red: 'image(images/life-red.png)',
                green: 'image(images/life-green.png)'
            },
            y: 20,
            x: 20
        }
    };

    return config;
});
