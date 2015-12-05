///<reference path="Common.ts" />
///<reference path="Projectile.ts" />

import Projectile = require("Projectile");
import Common = require("Common");
CartesianCoordinate = Common.CartesianCoordinate;
Dimensions_2D = Common.Dimensions_2D;
Vector_2D = Common.Vector_2D;

;


export class Star implements GameObject {
    static MAX_RADIUS:number = 3;
    color:string = "white";
    position:CartesianCoordinate;
    dimensions:Dimensions_2D; //todo, work this out from radius

    radius:number;
    twinkles:boolean = false;        //changes colour

    constructor(position:CartesianCoordinate) {
        this.position = position;
        this.radius = Math.round(Math.random() * Star.MAX_RADIUS);
        //10% chance
        this.twinkles = (Math.random() > 0.9);
    }

    draw(context:CanvasRenderingContext2D) {
        context.fillStyle = "#aaa";
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);


        context.fill();
    }

    update() {
        if (this.twinkles) {

        }
    }
}




