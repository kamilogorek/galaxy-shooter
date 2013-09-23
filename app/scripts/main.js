'use strict';

require(['game', 'background', 'player', 'ui', 'asteroids', 'sounds'], function (game, background, player, ui, asteroids, sounds) {
    // TODO: Add README.md and fix grunt build

    // TODO: Allow to choose ship

    var startScreen = document.querySelector('.start-screen');
    var uiScreen = document.querySelector('.ui');
    var endScreen = document.querySelector('.end-screen');
    var startButton = document.querySelector('.start-game');
    var restartButton = document.querySelector('.restart-game');
    var endScore = document.querySelector('.end-score');

    background.init();

    function initGame () {
        sounds.pressButton.play();

        player.init();
        ui.init();
        asteroids.init();
    }

    startButton.addEventListener('click', function () {
        startScreen.style.display = 'none';
        uiScreen.style.display = 'block';

        initGame();
    });

    restartButton.addEventListener('click', function () {
        uiScreen.style.display = 'block';
        endScreen.style.display = 'none';

        initGame();
    });

    game.on('gameover', function () {
        endScore.innerText = ui.score;
        endScreen.style.display = 'block';
        uiScreen.style.display = 'none';
    });
});
