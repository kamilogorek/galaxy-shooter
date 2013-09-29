/* global Engine */
'use strict';

/*
 * TODO:
 * [ ] - Debug overall performance issue
 * [ ] - Fix particles performance issue
 * [ ] - Fix grunt build
 * [ ] - Fix keys persistence bug that happens from time to time
 *
 */

require(['config', 'game', 'background', 'player', 'ui', 'asteroids', 'sounds'], function (config, game, background, player, ui, asteroids, sounds) {
    var startScreen = document.querySelector('.start-screen');
    var uiScreen = document.querySelector('.ui');
    var shipScreen = document.querySelector('.ship-screen');
    var endScreen = document.querySelector('.end-screen');
    var ships = document.querySelectorAll('.ship');
    var startButton = document.querySelector('.start-game');
    var restartButton = document.querySelector('.restart-game');
    var pauseScreen = document.querySelector('.pause-screen');

    background.init();

    function initGame (color) {
        shipScreen.style.display = 'none';
        uiScreen.style.display = 'block';

        sounds.pressButton.play();
        player.init(color);
        ui.init(color);
        asteroids.init();
    }

    function showShipsScreen () {
        startScreen.style.display = 'none';
        shipScreen.style.display = 'block';
        endScreen.style.display = 'none';
    }

    function showEndScreen () {
        endScreen.style.display = 'block';
        uiScreen.style.display = 'none';
    }

    startButton.addEventListener('click', function () {
        showShipsScreen();
    });

    [].forEach.call(ships, function (ship) {
        ship.addEventListener('click', function () {
            initGame(this.id);
        });
    });

    restartButton.addEventListener('click', function () {
        showShipsScreen();
    });

    game.on('gameover', function () {
        showEndScreen();
    });

    game.on('pause', function () {
        pauseScreen.style.display = 'block';
    });

    game.on('unpause', function () {
        pauseScreen.style.display = 'none';
    });

    Engine.Input.on('keyup', function (e) {
        switch (e.key) {
        case config.keys.enter:
            // Allow to init game only when start/restart or ship choosing screen is visible
            if (window.getComputedStyle(startScreen).getPropertyValue('display') === 'block' ||
                window.getComputedStyle(endScreen).getPropertyValue('display') === 'block') {
                showShipsScreen();
            } else if (window.getComputedStyle(shipScreen).getPropertyValue('display') === 'block') {
                initGame(document.querySelector('.ship.active').id);
            }
            break;
        case config.keys.left:
            // Allow to use arrows only when ship choosing screen is visible
            if (window.getComputedStyle(shipScreen).getPropertyValue('display') === 'none') {
                return;
            }

            [].forEach.call(ships, function (ship) {
                ship.classList.toggle('active');
            });
            break;
        case config.keys.right:
            // Allow to use arrows only when ship choosing screen is visible
            if (window.getComputedStyle(shipScreen).getPropertyValue('display') === 'none') {
                return;
            }

            [].forEach.call(ships, function (ship) {
                ship.classList.toggle('active');
            });
            break;
        case config.keys.pause:
            // Allow to use pause only while game is already started
            if (window.getComputedStyle(startScreen).getPropertyValue('display') === 'block' ||
                window.getComputedStyle(endScreen).getPropertyValue('display') === 'block' ||
                window.getComputedStyle(shipScreen).getPropertyValue('display') === 'block') {
                return;
            }

            if (!game.paused) {
                game.stop();
                game.paused = true;
                game.trigger('pause');
            } else {
                game.play();
                game.paused = false;
                game.trigger('unpause');
            }
            break;
        }
    });

    // Simple console.log wrapper to enable debugMode
    window.debugMode = false;
    window.log = function () {
        if (!window.debugMode) { return; }
        window.console.log.apply(console, arguments);
    };

    // Init game without any start screens for faster debugging
    if (window.debugMode) {
        initGame('red');
    }
});
