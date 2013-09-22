/* global define, Engine */
'use strict';

define(['scene'], function (scene) {
    var Map = {};

    Map.init = function () {
        var blueStroke = new Engine.Geometry.Oval({
            originX: 0,
            originY: 0,
            radius: 150,
            fill: 'blue'
        });

        blueStroke.animationOptions = {
            grow: true,
            diff: 1
        };

        var blueFill = new Engine.Geometry.Oval({
            originX: 0,
            originY: 0,
            radius: 145,
            fill: 'black'
        });

        var redStroke = new Engine.Geometry.Oval({
            originX: 0,
            originY: 0,
            radius: 100,
            fill: 'red'
        });

        redStroke.animationOptions = {
            grow: true,
            diff: 2
        };

        var redFill = new Engine.Geometry.Oval({
            originX: 0,
            originY: 0,
            radius: 95,
            fill: 'black'
        });

        var greenStroke = new Engine.Geometry.Oval({
            originX: 0,
            originY: 0,
            radius: 50,
            fill: 'green'
        });

        greenStroke.animationOptions = {
            grow: false,
            diff: 3
        };

        var greenFill = new Engine.Geometry.Oval({
            originX: 0,
            originY: 0,
            radius: 45,
            fill: 'black'
        });

        var platforms = [
            blueStroke,
            blueFill,
            redStroke,
            redFill,
            greenStroke,
            greenFill
        ];

        var map = new Engine.Transform({
            name: 'platforms',
            children: platforms
        });

        scene.appendChild(map);

        new Engine.Timer({
            duration: 500,
            type: 'animation',
            autoplay: true,
            loop: true,
            on: {
                play: function () {
                },
                step: function() {
                    animateStroke(blueStroke);
                    animateStroke(greenStroke);
                    animateStroke(redStroke);
                },
                loop: function(){
                    blueStroke.animationOptions.grow = !blueStroke.animationOptions.grow;
                    redStroke.animationOptions.grow = !redStroke.animationOptions.grow;
                    greenStroke.animationOptions.grow = !greenStroke.animationOptions.grow;
                }
            }
        });

        function animateStroke (elem) {
            var radius;

            if (elem.animationOptions.grow) {
                radius = elem.radiusX + elem.animationOptions.diff;
            } else {
                radius = elem.radiusX - elem.animationOptions.diff;
            }

            elem.setRadius(radius);
        }
    }

    return Map;
});
