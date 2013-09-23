'use strict';

require.config({
    paths: {
        lodash: 'bower_components/lodash/lodash'
    }
});

require(['game', 'background', 'player', 'ui', 'asteroids', 'sounds'], function (game, background, player, ui, asteroids, sounds) {
    background.init();

    var startScreen = document.querySelector('.start-screen');
    var uiScreen = document.querySelector('.ui');
    var endScreen = document.querySelector('.end-screen');
    var startButton = document.querySelector('.start-game');
    var restartButton = document.querySelector('.restart-game');

    startButton.addEventListener('click', function () {
        startScreen.style.display = 'none';
        uiScreen.style.display = 'block';

        sounds.pressButton.play();

        player.init();
        ui.init();
        asteroids.init();
    });

    restartButton.addEventListener('click', function () {
        uiScreen.style.display = 'block';
        endScreen.style.display = 'none';

        sounds.pressButton.play();

        player.init();
        ui.init();
        asteroids.init();
    });

    game.on('gameover', function () {
        var endScore = document.querySelector('.end-score');

        endScore.innerText = ui.score;
        endScreen.style.display = 'block';
        uiScreen.style.display = 'none';

        // TODO: Reinit game
    });
});
