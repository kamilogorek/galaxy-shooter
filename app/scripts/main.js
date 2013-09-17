require.config({
    paths: {
        solpeo: 'libs/solpeo-engine'
    }
});

require(['app'], function (app) {
    'use strict';
    // use app here
    console.log(app);
});
