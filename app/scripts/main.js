'use strict';

require.config({
    paths: {
        lodash: 'bower_components/lodash/lodash'
    }
});

require(['game', 'background', 'player'], function (game, background, player) {
    background.init();
    player.init();

    game.on('gameover', function () {
        setTimeout(function () {
            background.init();
            player.create();
        }, 2000);
    });
});
