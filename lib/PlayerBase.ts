///<reference path="Common.ts" />
import Common = require("Common");
CartesianCoordinate = Common.CartesianCoordinate;
Dimensions_2D = Common.Dimensions_2D;

export class DestructibleScenery implements GameObject {

    static DEFAULT_SIZE:number = 5;
    position:CartesianCoordinate;
    dimensions:Dimensions_2D = new Dimensions_2D(DestructibleScenery.DEFAULT_SIZE, DestructibleScenery.DEFAULT_SIZE);
    color:string = "#0F9";
    active:boolean = true;

    constructor(position) {
        this.position = position;
    }

    draw(canvas:CanvasRenderingContext2D) {
        canvas.fillStyle = this.color;
        if (this.active) {
            canvas.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
        }
    }

    update(elapsedUnit) {
    }

    explode() {
        this.active = false;
        // todo boom graphic
    }
}

/**
 * The classic Green protective bases the player can hide behind
 */
export class PlayerBase implements GameObject {

    position:CartesianCoordinate; //the initial location the base is rendered, taken to be the top left of the base
    particles = [];

    static DEFAULT_COLUMNS:number = 7;

    constructor(position) {
        this.position = position;

        /* base looks like this based on the dimensions of each particle; 7 DEFAULT_COLUMNS
         -*****-
         *******
         *******
         **   **
         */
        //position relative to the base
        /*       for (var i = 0; i < 5; i++) {
         this.particles.push(new DestructibleScenery(new CartesianCoordinate(position.x + DestructibleScenery.DEFAULT_SIZE * (i + 1), position.y)));
         }
         for (var i = 0; i < 7; i++) {
         this.particles.push(new DestructibleScenery(new CartesianCoordinate(position.x + DestructibleScenery.DEFAULT_SIZE * i, position.y + DestructibleScenery.DEFAULT_SIZE * 1)));
         }
         for (var i = 0; i < 7; i++) {
         this.particles.push(new DestructibleScenery(new CartesianCoordinate(position.x + DestructibleScenery.DEFAULT_SIZE * i, position.y + DestructibleScenery.DEFAULT_SIZE * 2)));
         }
         for (var i = 0; i < 7; i++) {
         if (i !== 3 && i !== 4 && i !== 5)
         {
         this.particles.push(new DestructibleScenery(new CartesianCoordinate(position.x + DestructibleScenery.DEFAULT_SIZE * i, position.y + DestructibleScenery.DEFAULT_SIZE * 3)));
         }
         }*/
        for (var i = 0; i < 18; i++) {
            for (var j = 0; j < 10; j++) {
                this.particles.push(new DestructibleScenery(new CartesianCoordinate(
                        position.x + DestructibleScenery.DEFAULT_SIZE * i,
                        position.y + DestructibleScenery.DEFAULT_SIZE * j)))
            }
        }
    }

    draw(canvas:CanvasRenderingContext2D) {
        var self = this;
        self.particles.forEach(function (thing) {
            thing.draw(canvas);
        });
    }

    update(elapsedUnit) {
    }

}