/* global define */
'use strict';

define(function () {
    var Utils = {};

    Utils.requestAnimationFrame = (function () {
        return (window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            }).bind(window);
    })();

    return Utils;
});
