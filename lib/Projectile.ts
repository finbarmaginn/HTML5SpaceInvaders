import Game  from "Game";
export class Bullet implements GameObject {


    static SLOW_MOVEMENT_SPEED:number = 2;
    static MEDIUM_MOVEMENT_SPEED:number = 4;
    static FAST_MOVEMENT_SPEED:number = 6;
    static VERY_FAST_MOVEMENT_SPEED:number = 12;

    static SMALL_SIZE:number = 3;
    static LARGE_SIZE:number = 9;


    isFromPlayer:Boolean; //determines direction
    color:string;

    position:CartesianCoordinate;
    dimensions:Dimensions_2D;
    vector:Vector_2D;
    damageInflicted:number;


    active:boolean = true;

    constructor(position:CartesianCoordinate, vector:Vector_2D) {
        this.position = position;
        this.vector = vector;
    }

    inBounds() {
        return this.position.x >= 0 && (this.position.x - this.dimensions.width <= Game.Game.CANVAS_WIDTH ) &&
            this.position.y >= 0 && (this.position.y - this.dimensions.height <= Game.Game.CANVAS_HEIGHT);
    }

    draw(canvas:CanvasRenderingContext2D) {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
    }

    update(elapsedUnit) {
        this.position.x += this.vector.xVelocity * elapsedUnit;
        this.position.y += this.vector.yVelocity * elapsedUnit;
        this.active = this.active && this.inBounds();
    }
}

export class TinyBullet extends Bullet {


    //Grunts usually fire this
    constructor(postion:CartesianCoordinate, isFromPlayer, customVector:Vector_2D =null) {
        //players shoot upward

        if(!customVector){
            super(postion, new Vector_2D(0, isFromPlayer ? Bullet.SLOW_MOVEMENT_SPEED * -1 : Bullet.SLOW_MOVEMENT_SPEED));
        }else{
            super(postion, customVector);
        }
        this.dimensions = new Dimensions_2D(Bullet.SMALL_SIZE, Bullet.SMALL_SIZE);
        this.color = "white";
        this.damageInflicted = 1;

    }
}

export class PlayerBullet extends Bullet {

    //Grunts usually fire this
    constructor(postion:CartesianCoordinate, customVector:Vector_2D =null) {
        //players shoot upward

        if(!customVector){
            super(postion, new Vector_2D(0, Bullet.VERY_FAST_MOVEMENT_SPEED * -1 ));
        }else{
            super(postion, customVector);
        }
        this.dimensions = new Dimensions_2D(Bullet.SMALL_SIZE, Bullet.SMALL_SIZE);
        this.color = 0xAAB;
        this.damageInflicted = 1;
    }
}

export class LargeBullet extends Bullet {

    //stronger enemies usually fire this
    constructor(postion:CartesianCoordinate, isFromPlayer,customVector:Vector_2D =null) {
        //super(postion, new Vector_2D(0, Bullet.FAST_MOVEMENT_SPEED));

        if(!customVector){
            super(postion, new Vector_2D(0, isFromPlayer ? Bullet.FAST_MOVEMENT_SPEED * -1 : Bullet.FAST_MOVEMENT_SPEED));
        }else{
            super(postion, customVector);
        }

        this.dimensions = new Dimensions_2D(Bullet.LARGE_SIZE, Bullet.LARGE_SIZE);
        this.color = "yellow";
        this.damageInflicted = 3;
    }
}
