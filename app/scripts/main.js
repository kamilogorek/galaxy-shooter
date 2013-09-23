'use strict';

require.config({
    paths: {
        lodash: 'bower_components/lodash/lodash'
    }
});

require(['game', 'background', 'player', 'ui'], function (game, background, player, ui) {
    background.init();
    player.init();
    ui.init();

    game.on('gameover', function () {
        var msg = 'Game Over! Your score: ' + ui.score;
        alert(msg);
        // TODO: Reinit game
        // start();
    });
});
