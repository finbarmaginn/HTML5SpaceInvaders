/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game_1 = __webpack_require__(2);
	var game = new Game_1["default"]();
	//game.handleCollisions.bind(game);
	window.addEventListener("keydown", (game.onKeyDown.bind(game)));
	window.addEventListener("keyup", (game.onKeyUp.bind(game)));
	function gameLoop() {
	    requestAnimationFrame(gameLoop);
	    // Drawing code goes here
	    game.update();
	    game.draw();
	}
	gameLoop();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var PlayerBase_1 = __webpack_require__(3);
	var Player_1 = __webpack_require__(5);
	var Waves_1 = __webpack_require__(7);
	var Common_1 = __webpack_require__(4);
	var Game = (function () {
	    function Game() {
	        this.waveNumber = 0;
	        this.NUMBER_OF_STARS = 50;
	        this.FPS = 45; // this will depend on latency
	        this.enemies = [];
	        this.playerBullets = [];
	        this.enemyBulletsSideA = [];
	        this.canvas = document.getElementById('canvas');
	        this.stats = {
	            count: 0,
	            fps: 0,
	            update: 0,
	            draw: 0,
	            frame: 0 // update + draw
	        };
	        //background scenery objects
	        this.playerBaseHeight = 20;
	        this.playBaseColor = "blue";
	        this.spaceColor = "black";
	        this.stars = [];
	        //for the key events
	        this.rightDown = false;
	        this.leftDown = false;
	        this.upDown = false;
	        this.downDown = false;
	        this.space = false;
	        this.lastFrame = this.timestamp(); //init to current time
	        this.context2D = this.canvas.getContext("2d");
	        this.canvas.width = Game.CANVAS_WIDTH;
	        this.canvas.height = Game.CANVAS_HEIGHT;
	        this.createBases();
	        this.initGame();
	    }
	    //elapsedTime: number;
	    Game.prototype.update = function () {
	        var start = this.timestamp();
	        var elapsedTime = start - this.lastFrame;
	        var elapsedReduced = (elapsedTime / 1000.0) * Common_1.GAME_DEFAULTS.GAME_SPEED; // send dt as seconds
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
	    };
	    Game.prototype.timestamp = function () {
	        return new Date().getTime();
	    };
	    Game.prototype.createBases = function () {
	        this.bases = new Array(); // clear old one if there
	        var noOfBases = 4;
	        var spacing = Game.CANVAS_WIDTH / noOfBases;
	        for (var i = 0; i < noOfBases; i++) {
	            this.bases.push(new PlayerBase_1.PlayerBase(new Common_1.CartesianCoordinate(spacing / 2 + (spacing * i), Game.CANVAS_HEIGHT - 150)));
	        }
	    };
	    Game.prototype.onKeyDown = function (evt) {
	        if (evt.keyCode == Common_1.KEYS.RIGHT)
	            this.rightDown = true;
	        else if (evt.keyCode == Common_1.KEYS.LEFT)
	            this.leftDown = true;
	        else if (evt.keyCode == Common_1.KEYS.UP)
	            this.upDown = true;
	        else if (evt.keyCode == Common_1.KEYS.DOWN)
	            this.downDown = true;
	        if (evt.keyCode == Common_1.KEYS.SPACE) {
	            this.space = true;
	            this.playerBullets.push(this.player.shoot());
	        }
	        ;
	    };
	    Game.prototype.onKeyUp = function (evt) {
	        if (evt.keyCode == Common_1.KEYS.RIGHT)
	            this.rightDown = false;
	        if (evt.keyCode == Common_1.KEYS.LEFT)
	            this.leftDown = false;
	        if (evt.keyCode == Common_1.KEYS.UP)
	            this.upDown = false;
	        if (evt.keyCode == Common_1.KEYS.DOWN)
	            this.downDown = false;
	        if (evt.keyCode == Common_1.KEYS.SPACE)
	            this.space = false;
	    };
	    Game.prototype.initGame = function () {
	        //bottom middle
	        this.player = new Player_1["default"](new Common_1.CartesianCoordinate(Game.CANVAS_WIDTH / 2, Game.CANVAS_HEIGHT - this.playerBaseHeight - Player_1["default"].DEFAULT_HEIGHT));
	        this.player.OnShoot = function (bullet) {
	            this.playerBullets.push(bullet);
	        };
	        this.nextWave();
	        this.createStars();
	    };
	    Game.prototype.drawBackground = function () {
	        var self = this;
	        self.stars.forEach(function (thing) {
	            thing.draw(self.context2D);
	        });
	        self.context2D.fillStyle = self.spaceColor;
	        self.context2D.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
	        self.context2D.fillStyle = self.playBaseColor;
	        self.context2D.fillRect(0, Game.CANVAS_HEIGHT - self.playerBaseHeight, Game.CANVAS_WIDTH, self.playerBaseHeight);
	    };
	    Game.prototype.addEnemy = function (enemy) {
	        this.enemies.push(enemy);
	    };
	    // Reset the enemies for the next wave
	    Game.prototype.nextWave = function () {
	        this.waveNumber++;
	        this.waveNumber % 5 === 0 ? this.createBases() : null; //give the user new bases every 5 waves
	        switch (this.waveNumber) {
	            case 1:
	                {
	                    this.enemies = Waves_1["default"].Wave1();
	                    break;
	                }
	            case 2:
	                {
	                    this.enemies = Waves_1["default"].Wave2();
	                    break;
	                }
	            case 3:
	                {
	                    this.enemies = Waves_1["default"].Wave3();
	                    break;
	                }
	            case 4:
	                {
	                    this.enemies = Waves_1["default"].Wave4();
	                    break;
	                }
	            case 5:
	                {
	                    this.enemies = Waves_1["default"].Wave5();
	                    break;
	                }
	            case 6:
	                {
	                    this.enemies = Waves_1["default"].Wave6();
	                    break;
	                }
	            case 7:
	                {
	                    this.enemies = Waves_1["default"].Wave7();
	                    break;
	                }
	            case 8:
	                {
	                    this.enemies = Waves_1["default"].Wave8();
	                    break;
	                }
	                alert("You win!! Well done.");
	        }
	    };
	    //todo
	    Game.prototype.createStars = function () {
	        for (var i = 0; i <= this.NUMBER_OF_STARS; i++) {
	            var randX = Math.round(Math.random() * Game.CANVAS_WIDTH);
	            var randY = Math.round(Math.random() * Game.CANVAS_HEIGHT);
	        }
	    };
	    Game.prototype.collides = function (a, b) {
	        return a.position.x < b.position.x + b.dimensions.width &&
	            a.position.x + a.dimensions.width > b.position.x &&
	            a.position.y < b.position.y + b.dimensions.height &&
	            a.position.y + a.dimensions.height > b.position.y;
	    };
	    Game.prototype.handleCollisions = function () {
	        var self = this;
	        self.playerBullets.forEach(function (bullet) {
	            self.enemies.forEach(function (enemy) {
	                if (self.collides(bullet, enemy)) {
	                    enemy.takeHit(bullet);
	                    bullet.active = false;
	                }
	            });
	            //todo optimise for max base height
	            self.bases.forEach(function (base) {
	                base.particles.forEach(function (particle) {
	                    if (self.collides(bullet, particle)) {
	                        particle.explode();
	                        bullet.active = false;
	                    }
	                });
	            });
	        });
	        self.enemyBulletsSideA.forEach(function (bullet) {
	            if (self.collides(bullet, self.player)) {
	                self.player.explode();
	                bullet.active = false;
	            }
	            self.bases.forEach(function (base) {
	                base.particles.forEach(function (particle) {
	                    if (self.collides(bullet, particle)) {
	                        particle.explode();
	                        bullet.active = false;
	                    }
	                });
	            });
	        });
	    };
	    Game.prototype.draw = function () {
	        this.drawBackground();
	        this.player.draw(this.context2D);
	        var that = this;
	        this.enemies.forEach(function (thing) {
	            thing.draw(that.context2D);
	        });
	        this.playerBullets.forEach(function (thing) {
	            thing.draw(that.context2D);
	        });
	        this.enemyBulletsSideA.forEach(function (thing) {
	            thing.draw(that.context2D);
	        });
	        this.bases.forEach(function (thing) {
	            thing.draw(that.context2D);
	        });
	        this.drawStats(this.context2D);
	    };
	    Game.prototype.ReverseEnemyDirectionIfOutOfBoundsAndDropDown = function () {
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
	        this.enemies.forEach(function (enemy) {
	            //moving to the right
	            enemy.vector.xVelocity = enemy.vector.xVelocity * -1;
	            enemy.position.x += offset * -1;
	            //   enemy.position.y += enemy.dimensions.height;
	            enemy.position.y += 10;
	        });
	    };
	    Game.prototype.updateEnemies = function (elapsedUnit) {
	        var self = this;
	        self.enemies = self.enemies.filter(function (enemy) {
	            return enemy.active;
	        });
	        self.enemies.forEach(function (enemy) {
	            enemy.update(elapsedUnit); // this might move things out of bounds so check next
	        });
	        self.ReverseEnemyDirectionIfOutOfBoundsAndDropDown();
	        //shoot after above check is done
	        self.enemies.forEach(function (enemy) {
	            if (Math.random() < enemy.probabilityOfShooting) {
	                var fire = enemy.shoot();
	                if (fire.hasOwnProperty("length")) {
	                    self.enemyBulletsSideA = self.enemyBulletsSideA.concat(fire);
	                }
	                else {
	                    self.enemyBulletsSideA.push(fire);
	                }
	            }
	        });
	    };
	    /**
	     * Remove scenery that has been hit
	     */
	    Game.prototype.updateBases = function () {
	        var self = this;
	        self.bases.forEach(function (base) {
	            base.particles = base.particles.filter(function (particle) {
	                return particle.active;
	            });
	        });
	    };
	    Game.prototype.updatePlayer = function (elapsedTime) {
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
	        this.player.update(elapsedTime);
	        this.player.clamp(Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
	    };
	    Game.prototype.updateBullets = function (elapsedUnit) {
	        this.playerBullets = this.playerBullets.filter(function (bullet) {
	            return bullet.active;
	        });
	        this.playerBullets.forEach(function (bullet) {
	            bullet.update(elapsedUnit);
	        });
	        this.enemyBulletsSideA = this.enemyBulletsSideA.filter(function (bullet) {
	            return bullet.active;
	        });
	        this.enemyBulletsSideA.forEach(function (bullet) {
	            bullet.update(elapsedUnit);
	        });
	    };
	    //Pluming
	    Game.prototype.addEvent = function (obj, type, fn) {
	        obj.addEventListener(type, fn, false);
	    };
	    Game.prototype.removeEvent = function (obj, type, fn) {
	        obj.removeEventListener(type, fn, false);
	    };
	    Game.prototype.resetStats = function () {
	        this.stats = {
	            count: 0,
	            fps: 0,
	            update: 0,
	            draw: 0,
	            frame: 0 // update + draw
	        };
	    };
	    //_______________________________________________________________________________todo remove this in prod
	    Game.prototype.updateStats = function (update, draw) {
	        this.stats.update = Math.max(1, update);
	        this.stats.draw = Math.max(1, draw);
	        this.stats.frame = this.stats.update + this.stats.draw;
	        this.stats.count = this.stats.count + 1;
	        this.stats.fps = Math.min(this.FPS, 1000 / this.stats.frame);
	    };
	    Game.prototype.drawStats = function (ctx) {
	        ctx.fillStyle = 'white';
	        ctx.fillText("frame: " + Math.round(this.stats.count), Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 60);
	        ctx.fillText("fps: " + Math.round(this.stats.fps), Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 50);
	        ctx.fillText("update: " + Math.round(this.stats.update) + "ms", Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 40);
	        ctx.fillText("draw: " + Math.round(this.stats.draw) + "ms", Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 30);
	        ctx.fillText("wave: " + this.waveNumber, Game.CANVAS_WIDTH - 100, Game.CANVAS_HEIGHT - 20);
	    };
	    Game.prototype.loadImages = function (sources, callback) {
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
	                    if (--count == 0)
	                        callback(images);
	                });
	            }
	        }
	    };
	    Game.CANVAS_WIDTH = 800;
	    Game.CANVAS_HEIGHT = 600;
	    return Game;
	})();
	exports.__esModule = true;
	exports["default"] = Game;
	//});


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Common_1 = __webpack_require__(4);
	var DestructibleScenery = (function () {
	    function DestructibleScenery(position) {
	        this.dimensions = new Common_1.Dimensions_2D(DestructibleScenery.DEFAULT_SIZE, DestructibleScenery.DEFAULT_SIZE);
	        this.color = "#0F9";
	        this.active = true;
	        this.position = position;
	    }
	    DestructibleScenery.prototype.draw = function (canvas) {
	        canvas.fillStyle = this.color;
	        if (this.active) {
	            canvas.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	        }
	    };
	    DestructibleScenery.prototype.update = function (elapsedUnit) {
	    };
	    DestructibleScenery.prototype.explode = function () {
	        this.active = false;
	        // todo boom graphic
	    };
	    DestructibleScenery.DEFAULT_SIZE = 5;
	    return DestructibleScenery;
	})();
	exports.DestructibleScenery = DestructibleScenery;
	/**
	 * The classic Green protective bases the player can hide behind
	 */
	var PlayerBase = (function () {
	    function PlayerBase(position) {
	        this.particles = [];
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
	                this.particles.push(new DestructibleScenery(new Common_1.CartesianCoordinate(position.x + DestructibleScenery.DEFAULT_SIZE * i, position.y + DestructibleScenery.DEFAULT_SIZE * j)));
	            }
	        }
	    }
	    PlayerBase.prototype.draw = function (canvas) {
	        var self = this;
	        self.particles.forEach(function (thing) {
	            thing.draw(canvas);
	        });
	    };
	    PlayerBase.prototype.update = function (elapsedUnit) {
	    };
	    PlayerBase.DEFAULT_COLUMNS = 7;
	    return PlayerBase;
	})();
	exports.PlayerBase = PlayerBase;


/***/ },
/* 4 */
/***/ function(module, exports) {

	exports.KEYS = {
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
	};
	//think of these speeds as relative speeds t
	exports.GAME_DEFAULTS = {
	    GAME_SPEED: 50 // the higher the number the faster the game will run
	};
	var CartesianCoordinate = (function () {
	    function CartesianCoordinate(x, y) {
	        this.x = x;
	        this.y = y;
	    }
	    return CartesianCoordinate;
	})();
	exports.CartesianCoordinate = CartesianCoordinate;
	var Dimensions_2D = (function () {
	    function Dimensions_2D(width, height) {
	        this.width = width;
	        this.height = height;
	    }
	    return Dimensions_2D;
	})();
	exports.Dimensions_2D = Dimensions_2D;
	//todo create 3D vector if game will be ported to WebGl
	/**
	 * signifies movement in 3D
	 */
	var Vector_2D = (function () {
	    function Vector_2D(xVelocity, yVelocity) {
	        this.xVelocity = 0; //by default bullets go straight down
	        this.xVelocity = xVelocity;
	        this.yVelocity = yVelocity;
	    }
	    return Vector_2D;
	})();
	exports.Vector_2D = Vector_2D;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Common_1 = __webpack_require__(4);
	var Projectile_1 = __webpack_require__(6);
	var Player = (function () {
	    function Player(position) {
	        this.color = "#F0A";
	        this.dimensions = new Common_1.Dimensions_2D(Player.DEFAULT_WIDTH, Player.DEFAULT_HEIGHT);
	        this.vector = new Common_1.Vector_2D(0, 0);
	        this.DefaultMovementSpeed = 7;
	        this.position = position;
	    }
	    Player.prototype.draw = function (context2D) {
	        context2D.fillStyle = this.color;
	        context2D.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	        context2D.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	        // var path = new Path2D('M 100,100 h 50 v 50 h 50');
	        // context2D.stroke(path);
	    };
	    Player.prototype.update = function (elapsedUnit) {
	        this.position.x += this.vector.xVelocity * elapsedUnit;
	        this.position.y += this.vector.yVelocity * elapsedUnit;
	    };
	    Player.prototype.clamp = function (gameWidth, gameHeight) {
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
	    };
	    Player.prototype.shoot = function () {
	        // todo Sound.play("shoot");
	        var bulletPosition = this.midpoint();
	        return new Projectile_1.PlayerBullet(bulletPosition);
	    };
	    Player.prototype.midpoint = function () {
	        return new Common_1.CartesianCoordinate(this.position.x + this.dimensions.width / 2, this.position.y + this.dimensions.height / 2);
	    };
	    //todo
	    Player.prototype.explode = function () {
	        this.color = "#F00";
	    };
	    Player.DEFAULT_HEIGHT = 20;
	    Player.DEFAULT_WIDTH = 20;
	    return Player;
	})();
	exports.__esModule = true;
	exports["default"] = Player;
	;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Game_1 = __webpack_require__(2);
	var Common_1 = __webpack_require__(4);
	var Bullet = (function () {
	    function Bullet(position, vector) {
	        this.active = true;
	        this.position = position;
	        this.vector = vector;
	    }
	    Bullet.prototype.inBounds = function () {
	        return this.position.x >= 0 && (this.position.x - this.dimensions.width <= Game_1["default"].CANVAS_WIDTH) &&
	            this.position.y >= 0 && (this.position.y - this.dimensions.height <= Game_1["default"].CANVAS_HEIGHT);
	    };
	    Bullet.prototype.draw = function (canvas) {
	        canvas.fillStyle = this.color;
	        canvas.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	    };
	    Bullet.prototype.update = function (elapsedUnit) {
	        this.position.x += this.vector.xVelocity * elapsedUnit;
	        this.position.y += this.vector.yVelocity * elapsedUnit;
	        this.active = this.active && this.inBounds();
	    };
	    Bullet.SLOW_MOVEMENT_SPEED = 2;
	    Bullet.MEDIUM_MOVEMENT_SPEED = 4;
	    Bullet.FAST_MOVEMENT_SPEED = 6;
	    Bullet.VERY_FAST_MOVEMENT_SPEED = 12;
	    Bullet.SMALL_SIZE = 3;
	    Bullet.LARGE_SIZE = 9;
	    return Bullet;
	})();
	exports.Bullet = Bullet;
	var TinyBullet = (function (_super) {
	    __extends(TinyBullet, _super);
	    //Grunts usually fire this
	    function TinyBullet(postion, isFromPlayer, customVector) {
	        //players shoot upward
	        if (customVector === void 0) { customVector = null; }
	        if (!customVector) {
	            _super.call(this, postion, new Common_1.Vector_2D(0, isFromPlayer ? Bullet.SLOW_MOVEMENT_SPEED * -1 : Bullet.SLOW_MOVEMENT_SPEED));
	        }
	        else {
	            _super.call(this, postion, customVector);
	        }
	        this.dimensions = new Common_1.Dimensions_2D(Bullet.SMALL_SIZE, Bullet.SMALL_SIZE);
	        this.color = "white";
	        this.damageInflicted = 1;
	    }
	    return TinyBullet;
	})(Bullet);
	exports.TinyBullet = TinyBullet;
	var PlayerBullet = (function (_super) {
	    __extends(PlayerBullet, _super);
	    //Grunts usually fire this
	    function PlayerBullet(postion, customVector) {
	        //players shoot upward
	        if (customVector === void 0) { customVector = null; }
	        if (!customVector) {
	            _super.call(this, postion, new Common_1.Vector_2D(0, Bullet.VERY_FAST_MOVEMENT_SPEED * -1));
	        }
	        else {
	            _super.call(this, postion, customVector);
	        }
	        this.dimensions = new Common_1.Dimensions_2D(Bullet.SMALL_SIZE, Bullet.SMALL_SIZE);
	        this.color = 0xAAAABB;
	        this.damageInflicted = 1;
	    }
	    return PlayerBullet;
	})(Bullet);
	exports.PlayerBullet = PlayerBullet;
	var LargeBullet = (function (_super) {
	    __extends(LargeBullet, _super);
	    //stronger enemies usually fire this
	    function LargeBullet(postion, isFromPlayer, customVector) {
	        //super(postion, new Vector_2D(0, Bullet.FAST_MOVEMENT_SPEED));
	        if (customVector === void 0) { customVector = null; }
	        if (!customVector) {
	            _super.call(this, postion, new Common_1.Vector_2D(0, isFromPlayer ? Bullet.FAST_MOVEMENT_SPEED * -1 : Bullet.FAST_MOVEMENT_SPEED));
	        }
	        else {
	            _super.call(this, postion, customVector);
	        }
	        this.dimensions = new Common_1.Dimensions_2D(Bullet.LARGE_SIZE, Bullet.LARGE_SIZE);
	        this.color = "yellow";
	        this.damageInflicted = 3;
	    }
	    return LargeBullet;
	})(Bullet);
	exports.LargeBullet = LargeBullet;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Invaders_1 = __webpack_require__(8);
	var Common_1 = __webpack_require__(4);
	exports.__esModule = true;
	exports["default"] = {
	    Wave1: function () {
	        var arr = [];
	        var horizontalGap = 10;
	        var verticalGap = 10;
	        for (var i = 0; i <= 6; i++) {
	            for (var j = 0; j <= 3; j++) {
	                var enemy;
	                enemy = new Invaders_1.EnemyGrunt(new Common_1.CartesianCoordinate(10 + i * (Invaders_1.Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Invaders_1.Enemy.DEFAULT_HEIGHT + verticalGap))));
	                enemy.vector.xVelocity = Invaders_1.Enemy.DEFAULT_HORIZONTAL_SPEED;
	                arr.push(enemy);
	            }
	        }
	        return arr;
	    },
	    Wave2: function () {
	        var arr = [];
	        var horizontalGap = 10;
	        var verticalGap = 10;
	        for (var i = 0; i <= 6; i++) {
	            for (var j = 0; j <= 3; j++) {
	                if (j == 0) {
	                    var enemy = new Invaders_1.EnemyBoss(new Common_1.CartesianCoordinate(10 + i * (Invaders_1.Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Invaders_1.Enemy.DEFAULT_HEIGHT + verticalGap))));
	                }
	                else {
	                    enemy = new Invaders_1.EnemyGrunt(new Common_1.CartesianCoordinate(10 + i * (Invaders_1.Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Invaders_1.Enemy.DEFAULT_HEIGHT + verticalGap))));
	                }
	                enemy.vector.xVelocity = Invaders_1.Enemy.DEFAULT_HORIZONTAL_SPEED;
	                arr.push(enemy);
	            }
	        }
	        return arr;
	    },
	    Wave3: function () {
	        var arr = [];
	        var horizontalGap = 10;
	        var verticalGap = 10;
	        for (var i = 0; i <= 8; i++) {
	            for (var j = 0; j <= 3; j++) {
	                if (j == 0 || j === 1) {
	                    var enemy = new Invaders_1.EnemyBoss(new Common_1.CartesianCoordinate(10 + i * (Invaders_1.Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Invaders_1.Enemy.DEFAULT_HEIGHT + verticalGap))));
	                }
	                else {
	                    enemy = new Invaders_1.EnemyGrunt(new Common_1.CartesianCoordinate(10 + i * (Invaders_1.Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Invaders_1.Enemy.DEFAULT_HEIGHT + verticalGap))));
	                }
	                enemy.vector.xVelocity = Invaders_1.Enemy.DEFAULT_HORIZONTAL_SPEED;
	                arr.push(enemy);
	            }
	        }
	        return arr;
	    },
	    Wave4: function () {
	        var arr = [];
	        var horizontalGap = 10;
	        var verticalGap = 10;
	        for (var i = 0; i <= 7; i++) {
	            for (var j = 0; j <= 2; j++) {
	                var enemy = new Invaders_1.EnemyBoss(new Common_1.CartesianCoordinate(10 + i * (Invaders_1.Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Invaders_1.Enemy.DEFAULT_HEIGHT + verticalGap))));
	                enemy.vector.xVelocity = Invaders_1.Enemy.DEFAULT_HORIZONTAL_SPEED;
	                arr.push(enemy);
	            }
	        }
	        return arr;
	    },
	    Wave5: function () {
	        var arr = [];
	        var enemy = new Invaders_1.EnemyKing(new Common_1.CartesianCoordinate(10 + (Invaders_1.Enemy.DEFAULT_WIDTH), 10));
	        enemy.vector.xVelocity = Invaders_1.Enemy.DEFAULT_HORIZONTAL_SPEED;
	        arr.push(enemy);
	        return arr;
	    },
	    Wave6: function () {
	        var arr = [];
	        var horizontalGap = 10;
	        var verticalGap = 10;
	        for (var i = 0; i < 2; i++) {
	            var enemy = new Invaders_1.EnemyKing(new Common_1.CartesianCoordinate(10 + i * (Invaders_1.EnemyKing.DEFAULT_WIDTH + horizontalGap), 10));
	            enemy.vector.xVelocity = Invaders_1.Enemy.DEFAULT_HORIZONTAL_SPEED;
	            arr.push(enemy);
	        }
	        return arr;
	    },
	    Wave7: function () {
	        var arr = [];
	        var horizontalGap = 10;
	        var verticalGap = 10;
	        for (var i = 0; i < 2; i++) {
	            var enemy = new Invaders_1.EnemyKing(new Common_1.CartesianCoordinate(150 + i * (Invaders_1.EnemyKing.DEFAULT_WIDTH + horizontalGap), 10));
	            enemy.vector.xVelocity = Invaders_1.Enemy.DEFAULT_HORIZONTAL_SPEED;
	            arr.push(enemy);
	        }
	        for (var i = 0; i <= 10; i++) {
	            for (var j = 0; j <= 3; j++) {
	                var enemy;
	                enemy = new Invaders_1.EnemyGrunt(new Common_1.CartesianCoordinate(10 + i * (Invaders_1.Enemy.DEFAULT_WIDTH + horizontalGap), (verticalGap + Invaders_1.EnemyKing.DEFAULT_HEIGHT + j * (Invaders_1.Enemy.DEFAULT_HEIGHT + verticalGap))));
	                enemy.vector.xVelocity = Invaders_1.Enemy.DEFAULT_HORIZONTAL_SPEED;
	                arr.push(enemy);
	            }
	        }
	        return arr;
	    },
	    Wave8: function () {
	        var arr = [];
	        var horizontalGap = 10;
	        var verticalGap = 10;
	        for (var i = 0; i < 2; i++) {
	            var enemy = new Invaders_1.EnemyKing(new Common_1.CartesianCoordinate(150 + i * (Invaders_1.EnemyKing.DEFAULT_WIDTH + horizontalGap), 10));
	            enemy.vector.xVelocity = Invaders_1.Enemy.DEFAULT_HORIZONTAL_SPEED;
	            arr.push(enemy);
	        }
	        for (var i = 0; i <= 12; i++) {
	            for (var j = 0; j <= 2; j++) {
	                var enemy;
	                enemy = new Invaders_1.EnemyBoss(new Common_1.CartesianCoordinate(10 + i * (Invaders_1.Enemy.DEFAULT_WIDTH + horizontalGap), (verticalGap + Invaders_1.EnemyKing.DEFAULT_HEIGHT + j * (Invaders_1.Enemy.DEFAULT_HEIGHT + verticalGap))));
	                enemy.vector.xVelocity = Invaders_1.Enemy.DEFAULT_HORIZONTAL_SPEED;
	                arr.push(enemy);
	            }
	        }
	        return arr;
	    }
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Projectile_1 = __webpack_require__(6);
	var Common_1 = __webpack_require__(4);
	var Enemy = (function () {
	    function Enemy(position) {
	        this.dimensions = new Common_1.Dimensions_2D(Enemy.DEFAULT_WIDTH, Enemy.DEFAULT_HEIGHT);
	        this.vector = new Common_1.Vector_2D(0, 0);
	        this.active = true;
	        this.probabilityOfShooting = 0.0005; // on each game frame
	        this.position = position;
	    }
	    Enemy.prototype.draw = function (canvas) {
	        canvas.fillStyle = this.BasicColor;
	        canvas.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
	    };
	    Enemy.prototype.midpoint = function () {
	        return new Common_1.CartesianCoordinate(this.position.x + this.dimensions.width / 2, this.position.y + this.dimensions.height / 2);
	    };
	    Enemy.prototype.explode = function () {
	        this.active = false;
	        // todo boom graphic
	    };
	    Enemy.prototype.takeHit = function (bullet) {
	        this.health -= bullet.damageInflicted;
	        if (this.health <= 0) {
	            this.explode();
	        }
	    };
	    Enemy.prototype.update = function (elapsedUnit) {
	        this.position.x += this.vector.xVelocity * elapsedUnit;
	        //this.position.x+= this.xVelocity;
	        //this.position.y+= this.yVelocity;
	        //   this.active = this.active && this.inBounds();
	    };
	    Enemy.prototype.shootTinyBullet = function () {
	        var bulletPosition = this.midpoint();
	        var bulletToBeFired = new Projectile_1.TinyBullet(bulletPosition, false);
	        return bulletToBeFired;
	    };
	    Enemy.prototype.shootSmallFan = function () {
	        var num = 10;
	        //shoot at angle 225 - 295 degress
	        var arr = [];
	        for (var i = 0; i < num; i++) {
	            var angle = 225 + i * (90 / num);
	            var radAngle = (angle / 360) * 2 * Math.PI;
	            var customVector = new Common_1.Vector_2D(-Math.cos(radAngle), -Math.sin(radAngle));
	            arr.push(new Projectile_1.TinyBullet(this.midpoint(), false, customVector));
	        }
	        return arr;
	    };
	    Enemy.prototype.shootLargeSlowfan = function () {
	        var num = 50;
	        //shoot at angle 225 - 295 degress
	        var arr = [];
	        for (var i = 0; i < num; i++) {
	            var angle = 225 + i * (90 / num);
	            var radAngle = (angle / 360) * 2 * Math.PI;
	            var customVector = new Common_1.Vector_2D(-Math.cos(radAngle) / 2, -Math.sin(radAngle) / 2);
	            arr.push(new Projectile_1.TinyBullet(this.midpoint(), false, customVector));
	        }
	        return arr;
	    };
	    Enemy.prototype.shootLargeFastfan = function () {
	        var num = 50;
	        //shoot at angle 225 - 295 degress
	        var arr = [];
	        for (var i = 0; i < num; i++) {
	            var angle = 225 + i * (90 / num);
	            var radAngle = (angle / 360) * 2 * Math.PI;
	            var customVector = new Common_1.Vector_2D(-Math.cos(radAngle) * 3, -Math.sin(radAngle) * 3);
	            arr.push(new Projectile_1.LargeBullet(this.midpoint(), false, customVector));
	        }
	        return arr;
	    };
	    Enemy.prototype.shoot = function () {
	        return this.shootTinyBullet();
	    };
	    Enemy.DEFAULT_HEIGHT = 12;
	    Enemy.DEFAULT_WIDTH = 30;
	    Enemy.DEFAULT_HORIZONTAL_SPEED = 2;
	    return Enemy;
	})();
	exports.Enemy = Enemy;
	var EnemyGrunt = (function (_super) {
	    __extends(EnemyGrunt, _super);
	    function EnemyGrunt(position) {
	        _super.call(this, position);
	        this.BasicColor = "#0F9";
	        this.probabilityOfShooting = 0.001;
	        this.health = 1;
	    }
	    EnemyGrunt.prototype.shoot = function () {
	        // todo Sound.play("shoot");
	        return this.shootTinyBullet();
	    };
	    return EnemyGrunt;
	})(Enemy);
	exports.EnemyGrunt = EnemyGrunt;
	var EnemyBoss = (function (_super) {
	    __extends(EnemyBoss, _super);
	    function EnemyBoss(position) {
	        _super.call(this, position);
	        this.probabilityOfShootingLargeBulletWhenShootong = 0.2;
	        this.probabilityOfShootingScatterWhenShooting = 0.2;
	        this.BasicColor = "RED";
	        this.probabilityOfShooting = 0.003;
	        this.health = 3;
	    }
	    EnemyBoss.prototype.shoot = function () {
	        // todo Sound.play("shoot");
	        var bulletToFire;
	        var x = Math.random();
	        if (x >= 0 && x <= 0.3) {
	            bulletToFire = this.shootTinyBullet();
	        }
	        if (x > 0.3 && x <= 0.4) {
	            bulletToFire = this.shootSmallFan();
	        }
	        //slow fan of 100
	        if (x > 0.4 && x <= 0.5) {
	            // return this.shootLargeSlowfan();
	            bulletToFire = this.shootLargeFastfan();
	        }
	        else if (x > 0.5 && x < 1) {
	            bulletToFire = new Projectile_1.LargeBullet(this.midpoint(), false);
	        }
	        return bulletToFire;
	    };
	    return EnemyBoss;
	})(Enemy);
	exports.EnemyBoss = EnemyBoss;
	var EnemyKing = (function (_super) {
	    __extends(EnemyKing, _super);
	    function EnemyKing(position) {
	        _super.call(this, position);
	        this.BasicColor = "WHITE";
	        this.probabilityOfShooting = 0.03;
	        this.health = 15;
	        this.dimensions = new Common_1.Dimensions_2D(100, 40);
	    }
	    EnemyKing.prototype.shoot = function () {
	        // todo Sound.play("shoot");
	        var x = Math.random();
	        var bulletToFire;
	        if (x >= 0 && x <= 0.25) {
	            bulletToFire = this.shootTinyBullet();
	        }
	        if (x > 0.25 && x <= 0.45) {
	            bulletToFire = this.shootSmallFan();
	        }
	        //slow fan of 100
	        if (x > 0.45 && x <= 0.5) {
	            // return this.shootLargeSlowfan();
	            bulletToFire = this.shootLargeFastfan();
	        }
	        else if (x > 0.5 && x < 1) {
	            bulletToFire = new Projectile_1.LargeBullet(this.midpoint(), false);
	        }
	        return bulletToFire;
	    };
	    EnemyKing.DEFAULT_WIDTH = 100;
	    EnemyKing.DEFAULT_HEIGHT = 40;
	    return EnemyKing;
	})(Enemy);
	exports.EnemyKing = EnemyKing;


/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map