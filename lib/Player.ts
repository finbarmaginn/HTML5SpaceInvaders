import {CartesianCoordinate,Dimensions_2D,Vector_2D,GameObject} from "./Common";
import {TinyBullet,LargeBullet,Bullet,PlayerBullet}  from "./Projectile";

export default class Player implements GameObject {

  color:string = "#F0A";

  position:CartesianCoordinate;
  dimensions:Dimensions_2D = new Dimensions_2D(Player.DEFAULT_WIDTH, Player.DEFAULT_HEIGHT);
  vector:Vector_2D = new Vector_2D(0, 0);
  static DEFAULT_HEIGHT:number = 20;
  static DEFAULT_WIDTH:number = 20;
  DefaultMovementSpeed:number = 7;

  currentWeapon:Bullet;//todo add more
  public OnShoot:Function;

  constructor(position) {
    this.position = position;
  }

  draw(context2D:CanvasRenderingContext2D) {
    context2D.fillStyle = this.color;
    context2D.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
    context2D.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);

   // var path = new Path2D('M 100,100 h 50 v 50 h 50');
   // context2D.stroke(path);


  }

  update(elapsedUnit) {
    this.position.x += this.vector.xVelocity * elapsedUnit;
    this.position.y += this.vector.yVelocity * elapsedUnit;
  }

  clamp(gameWidth:number, gameHeight:number) {
    if (this.position.x < 0) {
      this.position.x = 0;
      return;
    }
    else if (this.position.x > (gameWidth - this.dimensions.width)) {
      this.position.x = gameWidth - this.dimensions.width;
      return;
    }
    else if (this.position.y < 0) {
      this.position.y = 0;
      return;
    }
    else if (this.position.y > (gameHeight - this.dimensions.height)) {
      this.position.y = gameHeight - this.dimensions.height;
      return;
    }
  }

  shoot() {
    // todo Sound.play("shoot");
    var bulletPosition:CartesianCoordinate = this.midpoint();
    return new PlayerBullet(bulletPosition);

  }

  midpoint() {
    return new CartesianCoordinate(this.position.x + this.dimensions.width / 2, this.position.y + this.dimensions.height / 2);
  }


  //todo
  explode() {
    this.color = "#F00";
  }

}
;






