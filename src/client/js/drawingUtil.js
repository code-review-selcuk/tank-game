var global = require('./global');
var Sprite = require('../../server/lib/sprite');

/**
 * This is the class that holds a reference to the canvas.
 * Here we will write all the drawing functions.
 */
class DrawingUtil {
    constructor(canvas, perspective = {x: global.gameWidth / 2, y: global.gameHeight / 2}) {
        this.canvas = canvas;
        this.context2D = canvas.getContext("2d");

        /**
         * Perspective is an important part of the DrawingUtil and
         * is necessary for almost all other drawing methods. This is the center of
         * where the client is 'looking' on the game board
         */
        this.perspective = perspective;

        this.tankHullImage = new Image();
        this.tankHullImage.src = "/img/sprite-tank-hull-256.png";

        this.tankGunImage = new Image();
        this.tankGunImage.src = "/img/sprite-tank-gun-256.png";
    }

    /**
     * By convention, name of drawing functions will be the key of the objects to draw from 
     * the "gameObjects" appended to the word "Draw". As an example, given
     * a key in "gameObjects" called "perspective" we will call the 
     * "perspectiveDraw" method.
     */

    /**
     * Draw the background
     */
    perspectiveDraw(perspective) {
        //here is using a repeating background image to draw the background
        var img = document.getElementById('background_image');
        var pattern = this.context2D.createPattern(img, 'repeat');
        this.context2D.fillStyle = pattern;

        //translate canvas to where the edge of the game board is
        var translateX = -(perspective.x - global.screenWidth/2);
        var translateY = -(perspective.y - global.screenHeight/2);
        
        this.context2D.translate(translateX, translateY);
        this.context2D.fillRect(0,0,global.gameWidth, global.gameHeight);
        this.context2D.translate(-translateX, -translateY);

        /**
         * For debugging purposes, draw helpful data about screenSize, gameWidth, and user position
         */
        this.context2D.font = "20px Arial";
        this.context2D.fillStyle = "red";
        this.context2D.fillText(`X: ${perspective.x}, Y: ${perspective.y}`, 10, 50);
        this.context2D.fillText(`Screen Width: ${global.screenWidth}, Screen Height: ${global.screenHeight}`,10,75);
        this.context2D.fillText(`Game Width: ${global.gameWidth}, Game Height: ${global.gameHeight}`, 10, 100);
    }

    /**
     * Draw all tanks (including user's tank).
     */
    tanksDraw(tanks) {
        var translateX = -(this.perspective.x - global.screenWidth / 2);
        var translateY = -(this.perspective.y - global.screenHeight / 2);

        this.context2D.translate(translateX, translateY);

        for(let tank of tanks) {
            // Draw tank hull
            Sprite.render(tank.spriteTankHull, this.context2D, this.tankHullImage, tank.x, tank.y, 2, 2, 0);

            // Draw tank gun
            Sprite.render(tank.spriteTankGun, this.context2D, this.tankGunImage, tank.x, tank.y, 2, 2, tank.rotationCorrection);

            // //draw circle in the center to represent tank
            // this.context2D.beginPath();
            // this.context2D.strokeStyle = 'red';
            // this.context2D.arc(tank.x, tank.y, 15, 0, 2 * Math.PI);
            // this.context2D.stroke();
            //
            // //draw tank gun
            // var x = tank.x;
            // var y = tank.y;
            // var r =  25;
            // var theta = tank.gunAngle;
            //
            // this.context2D.moveTo(x, y);
            // this.context2D.lineTo(x + r * Math.cos(theta), y - r * Math.sin(theta));
            // this.context2D.stroke();
        }

        this.context2D.translate(-translateX, -translateY);
    }

    /**
     * Draw the bullets
     */
    bulletsDraw(bullets){
        var translateX = -(this.perspective.x - global.screenWidth/2);
        var translateY = -(this.perspective.y - global.screenHeight/2);
        this.context2D.translate(translateX, translateY);

        for(var i = 0; i < bullets.length; i++){
            //draw circle in the center to represent bullet
            this.context2D.beginPath();
            this.context2D.strokeStyle = 'green';
            this.context2D.arc(bullets[i].x, bullets[i].y, 5, 0, 2*Math.PI);
            this.context2D.stroke();  
        }

        this.context2D.translate(-translateX, -translateY);

    }

    wallsDraw(walls){
        var translateX = -(this.perspective.x - global.screenWidth/2);
        var translateY = -(this.perspective.y - global.screenHeight/2);
        this.context2D.translate(translateX, translateY);
        this.context2D.fillStyle = 'black';

        for(var wall of walls){
            
            this.context2D.fillRect(wall.x, wall.y, wall.w, wall.h);
        }
        
        this.context2D.translate(-translateX, -translateY);

    }

    /**
     * Given gameObjects, call the appropriate method on the drawingUtil
     * to draw that object.
     */
    drawGameObjects(gameObjects) {
        for (var key in gameObjects) {
            if (gameObjects.hasOwnProperty(key) && typeof this[`${key}Draw`] !== 'undefined') {
                this[`${key}Draw`](gameObjects[key]);
            }
        }
    }

    setPerspective(x,y) {
        //shorthand ES6
        this.perspective = {x,y};
    }
}

module.exports = DrawingUtil;