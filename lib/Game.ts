import {PlayerBase,DestructibleScenery} from "./PlayerBase"
import Player from "./Player"
import Waves from "./Waves"

import {KEYS,GameObject,CartesianCoordinate,Dimensions_2D,Vector_2D,GAME_DEFAULTS} from "./Common";
import {TinyBullet,LargeBullet,Bullet,PlayerBullet}  from "./Projectile";
import {Enemy,EnemyGrunt,EnemyBoss,EnemyKing} from "./Invaders";

interface Number {
  clamp(min, max): number;
}



//to get src to compile
interface Object {
  extend(destination, source): any;
  construct(base): any;
}

export default class Game {
  static CANVAS_WIDTH:number = 1000;
  static CANVAS_HEIGHT:number = 800;

  waveNumber:number = 4;
  NUMBER_OF_STARS:number = 50;
  FPS:number = 45; // this will depend on latency
  bases:Array<PlayerBase>;
  enemies = [];
  playerBullets = [];

  enemyBulletsSideA = [];

  player:Player;

  canvas:HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');

  context2D:CanvasRenderingContext2D;

  stats = {
    count: 0,
    fps: 0,
    update: 0,
    draw: 0,
    frame: 0  // update + draw
  };

  //background scenery objects
  playerBaseHeight:number = 20;
  playBaseColor:string = "blue";
  spaceColor:string = "black";
  stars = [];


  //for the key events
  rightDown:boolean = false;
  leftDown:boolean = false;
  upDown:boolean = false;
  downDown:boolean = false;
  space:boolean = false;

  lastFrame:number = this.timestamp();//init to current time
  //elapsedTime: number;

  update() {
    var start = this.timestamp();
    var elapsedTime:number = start - this.lastFrame;
    var elapsedReduced:number = (elapsedTime / 1000.0) * GAME_DEFAULTS.GAME_SPEED; // send dt as seconds

    this.updateBullets(elapsedReduced);
    this.updatePlayer(elapsedReduced);
    this.updateEnemies(elapsedReduced);
    this.updateBases();
    this.handleCollisions();

    var middle = this.timestamp();

    this.draw();
    var end = this.timestamp();

    this.updateStats(middle - start, end - middle);
    this.lastFrame = start;

    if (this.enemies.length === 0) {
      this.nextWave();
    }
  }

  timestamp():number {
    return new Date().getTime();
  }

  constructor() {
    this.context2D = this.canvas.getContext("2d");
    this.canvas.width = Game.CANVAS_WIDTH;
    this.canvas.height = Game.CANVAS_HEIGHT;


    this.createBases();
    this.initGame();
  }

  createBases() {
    this.bases = new Array<PlayerBase>();// clear old one if there
    var noOfBases = 4;
    var spacing = Game.CANVAS_WIDTH / noOfBases;
    for (var i = 0; i < noOfBases; i++) {
      this.bases.push(new PlayerBase(new CartesianCoordinate(spacing / 2 + (spacing * i), Game.CANVAS_HEIGHT - 150)));
    }
  }

  onKeyDown(evt) {
    if (evt.keyCode == KEYS.RIGHT) this.rightDown = true;
    else if (evt.keyCode == KEYS.LEFT) this.leftDown = true;
    else if (evt.keyCode == KEYS.UP) this.upDown = true;
    else if (evt.keyCode == KEYS.DOWN) this.downDown = true;
    if (evt.keyCode == KEYS.SPACE) {
      this.space = true;
      this.playerBullets.push(this.player.shoot());
    }
    ;
  }

  onKeyUp(evt) {
    if (evt.keyCode == KEYS.RIGHT) this.rightDown = false;
    if (evt.keyCode == KEYS.LEFT) this.leftDown = false;
    if (evt.keyCode == KEYS.UP) this.upDown = false;
    if (evt.keyCode == KEYS.DOWN) this.downDown = false;
    if (evt.keyCode == KEYS.SPACE) this.space = false;
  }

  initGame() {
    //bottom middle
    this.player = new Player(new CartesianCoordinate(Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT - this.playerBaseHeight - Player.DEFAULT_HEIGHT));
    this.player.OnShoot = function (bullet:Bullet) {
      this.playerBullets.push(bullet);
    }
    this.nextWave();
    this.createStars();
  }

  drawBackground() {
    var self = this;
    self.stars.forEach(function (thing) {
      thing.draw(self.context2D);
    });
    self.context2D.fillStyle = self.spaceColor;
    self.context2D.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
    self.context2D.fillStyle = self.playBaseColor;
    self.context2D.fillRect(0, Game.CANVAS_HEIGHT - self.playerBaseHeight, Game.CANVAS_WIDTH, self.playerBaseHeight);
  }

  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  // Reset the enemies for the next wave
  nextWave() {
    this.waveNumber++;
    this.waveNumber % 5 === 0 ? this.createBases() : null; //give the user new bases every 5 waves

    switch (this.waveNumber) {
      case 1:
      {
        this.enemies = Waves.Wave1();
        break;
      }
      case 2:
      {
        this.enemies = Waves.Wave2();
        break;
      }
      case 3:
      {
        this.enemies = Waves.Wave3();
        break;
      }
      case 4:
      {
        this.enemies = Waves.Wave4();
        break;
      }
      case 5:
      {
        this.enemies = Waves.Wave5();
        break;
      }
      case 6:
      {
        this.enemies = Waves.Wave6();
        break;
      }
      case 7:
      {
        this.enemies = Waves.Wave7();
        break;
      }
      case 8:
      {
        this.enemies = Waves.Wave8();
        break;
      }
        alert("You win!! Well done.");
    }
  }

//todo
  createStars() {
    for (var i = 0; i <= this.NUMBER_OF_STARS; i++) {
      var randX = Math.round(Math.random() * Game.CANVAS_WIDTH);
      var randY = Math.round(Math.random() * Game.CANVAS_HEIGHT);
      // var star = new Star(randX, randY);
      //  this.stars.push(star);
    }
  }

  collides(a:GameObject, b:GameObject) {
    return a.position.x < b.position.x + b.dimensions.width &&
      a.position.x + a.dimensions.width > b.position.x &&
      a.position.y < b.position.y + b.dimensions.height &&
      a.position.y + a.dimensions.height > b.position.y;
  }

  handleCollisions() {
    var self = this;
    self.playerBullets.forEach(function (bullet:Bullet) {
        self.enemies.forEach(function (enemy:Enemy) {
          if (self.collides(bullet, enemy)) {

            enemy.takeHit(bullet);
            bullet.active = false;
          }
        });
        //todo optimise for max base height
        self.bases.forEach(function (base:PlayerBase) {

          base.particles.forEach(function (particle:DestructibleScenery) {
            if (self.collides(bullet, particle)) {
              particle.explode();
              bullet.active = false;
            }
          })
        })


      }
    );


    self.enemyBulletsSideA.forEach(function (bullet:Bullet) {
      if (self.collides(bullet, self.player)) {
        self.player.explode();
        bullet.active = false;
      }
      self.bases.forEach(function (base:PlayerBase) {
        base.particles.forEach(function (particle:DestructibleScenery) {
          if (self.collides(bullet, particle)) {
            particle.explode();
            bullet.active = false;
          }
        })
      })
    });
  }

  draw() {
    this.drawBackground();
    this.player.draw(this.context2D);

    var that = this;
    this.enemies.forEach(function (thing) {
      thing.draw(that.context2D);
    });
    this.playerBullets.forEach(function (thing:Bullet) {
      thing.draw(that.context2D);
    });
    this.enemyBulletsSideA.forEach(function (thing:Bullet) {
      thing.draw(that.context2D);
    });
    this.bases.forEach(function (thing:PlayerBase) {
      thing.draw(that.context2D);
    });
    this.drawStats(this.context2D);

  }

  ReverseEnemyDirectionIfOutOfBoundsAndDropDown():boolean {
    var offset = 0;
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].position.x < 0) {
        offset = this.enemies[i].position.x;
        break;
      }
      else if (this.enemies[i].position.x > (Game.CANVAS_WIDTH - this.enemies[i].dimensions.width)) {
        offset = this.enemies[i].position.x - (Game.CANVAS_WIDTH - this.enemies[i].dimensions.width);
        break;
      }
    }
    if (offset === 0) {
      return;
    }

    this.enemies.forEach(function (enemy:Enemy) {
      //moving to the right
      enemy.vector.xVelocity = enemy.vector.xVelocity * -1;
      enemy.position.x += offset * -1;
      //   enemy.position.y += enemy.dimensions.height;
      enemy.position.y += 10;
    });
  }

  updateEnemies(elapsedUnit:number) {
    var self = this;

    self.enemies = self.enemies.filter(function (enemy) {
      return enemy.active;
    });

    self.enemies.forEach(function (enemy:Enemy) {
      enemy.update(elapsedUnit);// this might move things out of bounds so check next
    });

    self.ReverseEnemyDirectionIfOutOfBoundsAndDropDown();

    //shoot after above check is done
    self.enemies.forEach(function (enemy:Enemy) {

      if (Math.random() < enemy.probabilityOfShooting) {
        var fire = enemy.shoot();
        if (fire.hasOwnProperty("length")) {
          self.enemyBulletsSideA = self.enemyBulletsSideA.concat(fire);
        } else {
          self.enemyBulletsSideA.push(fire);
        }
      }
    });

  }

  /**
   * Remove scenery that has been hit
   */
  updateBases() {
    var self = this;
    self.bases.forEach(function (base:PlayerBase) {
      base.particles = base.particles.filter(function (particle) {
        return particle.active;
      });
    });
  }

  updatePlayer(elapsedTime:number) {
    if (this.leftDown) {
      this.player.vector.xVelocity = -this.player.DefaultMovementSpeed;
    }
    else if (this.rightDown) {
      this.player.vector.xVelocity = this.player.DefaultMovementSpeed;
    }
    else if (this.upDown) {
      this.player.vector.yVelocity = -this.player.DefaultMovementSpeed;
    }
    else if (this.downDown) {
      this.player.vector.yVelocity = this.player.DefaultMovementSpeed;
    }
    else {
      this.player.vector.xVelocity = 0;
      this.player.vector.yVelocity = 0;
    }
    this.player.update(elapsedTime)
    this.player.clamp(Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
  }

  updateBullets(elapsedUnit:number) {
    this.playerBullets = this.playerBullets.filter(function (bullet) {
      return bullet.active;
    });
    this.playerBullets.forEach(function (bullet:Bullet) {
      bullet.update(elapsedUnit);
    });

    this.enemyBulletsSideA = this.enemyBulletsSideA.filter(function (bullet) {
      return bullet.active;
    });
    this.enemyBulletsSideA.forEach(function (bullet:Bullet) {
      bullet.update(elapsedUnit);
    });
  }

//Pluming
  addEvent(obj, type, fn) {
    obj.addEventListener(type, fn, false);
  }

  removeEvent(obj, type, fn) {
    obj.removeEventListener(type, fn, false);
  }

  resetStats() {
    this.stats = {
      count: 0,
      fps: 0,
      update: 0,
      draw: 0,
      frame: 0  // update + draw
    };
  }

//_______________________________________________________________________________todo remove this in prod
  updateStats(update, draw) {
    this.stats.update = Math.max(1, update);
    this.stats.draw = Math.max(1, draw);
    this.stats.frame = this.stats.update + this.stats.draw;
    this.stats.count = this.stats.count + 1;
    this.stats.fps = Math.min(this.FPS, 1000 / this.stats.frame);
  }

  drawStats(ctx) {
    ctx.fillStyle = 'white';
    ctx.fillText("frame: " + Math.round(this.stats.count), Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 60);
    ctx.fillText("fps: " + Math.round(this.stats.fps), Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 50);
    ctx.fillText("update: " + Math.round(this.stats.update) + "ms", Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 40);
    ctx.fillText("draw: " + Math.round(this.stats.draw) + "ms", Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 30);
    ctx.fillText("wave: " + this.waveNumber, Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 20);
  }

  loadImages(sources, callback) { /* load multiple images and callback when ALL have finished loading */
    var images = {};
    var count = sources ? sources.length : 0;
    if (count == 0) {
      callback(images);
    }
    else {
      for (var n = 0; n < sources.length; n++) {
        var source = sources[n];
        var image = document.createElement('img');
        images[source] = image;
        this.addEvent(image, 'load', function () {
          if (--count == 0) callback(images);
        });
        //image.src = source;
      }
    }
  }

}

//});

