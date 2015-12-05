export var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    RETURN: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46,
    HOME: 36,
    END: 35,
    PAGEUP: 33,
    PAGEDOWN: 34,
    INSERT: 45,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    A: 65,
    L: 76,
    P: 80,
    Q: 81,
    TILDA: 192
}

//think of these speeds as relative speeds t
export var GAME_DEFAULTS = {
    GAME_SPEED: 50 // the higher the number the faster the game will run
}

export interface GameObject {

    draw(canvas:CanvasRenderingContext2D);
    update(elapsedUnit:number);
    position:CartesianCoordinate;
    dimensions:Dimensions_2D;

}

export class CartesianCoordinate {
    x:number ;
    y:number ;
    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }
}
export class Dimensions_2D{
    width:number ;
    height:number ;
    constructor(width:number, height:number) {
        this.width = width;
        this.height = height;
    }
}

//todo create 3D vector if game will be ported to WebGl
/**
 * signifies movement in 3D
 */

export class Vector_2D{
    xVelocity:number = 0; //by default bullets go straight down
    yVelocity:number; // depends on the type of bullet class

    constructor(xVelocity:number, yVelocity:number) {
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
    }
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * <pre>
 * (x * 255).clamp(0, 255)
 * </pre>
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};
