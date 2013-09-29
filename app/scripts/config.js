/* global define */
'use strict';

define(function () {
    return {
        viewport: {
            width: 600,
            height: 800,
            background: '#000'
        },

        background: {
            width: 2,
            height: 2,
            color: '#fff',
            // Number of sparkles
            count: 500,
            // Number of sparkles which opacity change every timer step
            animationCount: 5
        },

        keys: {
            enter: 'ENTER',
            pause: 'P',
            left: 'ARROW_LEFT',
            right: 'ARROW_RIGHT',
            up: 'ARROW_UP',
            down: 'ARROW_DOWN',
            shoot: 'SPACE'
        },

        ship: {
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
            // Initial position of ship
            lastPosition: {
                x: -38,
                y: 310
            },
            // Ship acceleration
            acc: 10,
            // Number of lives
            lives: 3,
            // Respawn delay
            respawnDelay: 2000
        },

        bullet: {
            width: 9,
            height: 33,
            asset: {
                red: 'image(images/laser-red.png)',
                green: 'image(images/laser-green.png)'
            },
            // Bullet acceleration
            acc: 20,
            // Interval between auto-shooting while shoot key is pressed
            shootingInterval: 200,
        },

        asteroid: {
            small: {
                width: 44,
                height: 42,
                asset: 'image(images/meteor-small.png)',
                points: 20
            },
            big: {
                width: 136,
                height: 111,
                asset: 'image(images/meteor-big.png)',
                points: 50
            },
            // Initial asteroids position
            top: -380,
            // Screen spacing from left and right side
            spacing: 15,
            // Min number of generated asteroids
            minNumber: 3,
            // Max number of generated asteroids
            maxNumber: 5,
            // Min acceleration of asteroids
            minAcc: 3,
            // Max acceleration of asteroids
            maxAcc: 5,
            // Chance of generating big asteroid in %
            chance: 0.20,
            // Max number of asteroids generated after destroing big one
            maxReplicateNumber: 5,
            // Delay between generation new asteroids in seconds
            generateDelay: 3,
            // Time between increasing difficulty in seconds. Difficulty increase by either increasing min/max of asteroids number of their acceleration. 25% chance each.
            changeDifficultyDelay: 10
        },

        ui: {
            life: {
                width: 35,
                height: 27,
                asset: {
                    red: 'image(images/life-red.png)',
                    green: 'image(images/life-green.png)'
                },
                // Position of life icons
                y: 20,
                x: 20
            }
        }
    };
});
