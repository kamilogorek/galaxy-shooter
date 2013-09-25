'use strict';

require(['game', 'background', 'player', 'ui', 'asteroids', 'sounds'], function (game, background, player, ui, asteroids, sounds) {
    // TODO: Add README.md and fix grunt build

    var startScreen = document.querySelector('.start-screen');
    var uiScreen = document.querySelector('.ui');
    var shipScreen = document.querySelector('.ship-screen');
    var endScreen = document.querySelector('.end-screen');
    var ships = document.querySelectorAll('.ship');
    var startButton = document.querySelector('.start-game');
    var restartButton = document.querySelector('.restart-game');
    var endScore = document.querySelector('.end-score');

    background.init();

    function initGame (color) {
        sounds.pressButton.play();

        player.init(color);
        ui.init(color);
        asteroids.init();
    }

    startButton.addEventListener('click', function () {
        startScreen.style.display = 'none';
        shipScreen.style.display = 'block';
    });

    [].forEach.call(ships, function (ship) {
        ship.addEventListener('click', function () {
            shipScreen.style.display = 'none';
            uiScreen.style.display = 'block';

            initGame(this.id);
        });
    });

    restartButton.addEventListener('click', function () {
        endScreen.style.display = 'none';
        shipScreen.style.display = 'block';
    });

    game.on('gameover', function () {
        endScore.innerText = ui.score;
        endScreen.style.display = 'block';
        uiScreen.style.display = 'none';
    });
});
