import {Enemy,EnemyGrunt,EnemyBoss,EnemyKing} from "./Invaders";
import {CartesianCoordinate,Dimensions_2D,Vector_2D} from "./Common";


export default {
  Wave1: function () {
    var arr = []
    var horizontalGap = 10;
    var verticalGap = 10;

    for (var i = 0; i <= 6; i++) {
      for (var j = 0; j <= 3; j++) {
        var enemy:Enemy;
        enemy = new EnemyGrunt(new CartesianCoordinate(10 + i * (Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Enemy.DEFAULT_HEIGHT + verticalGap))));
        enemy.vector.xVelocity = Enemy.DEFAULT_HORIZONTAL_SPEED;
        arr.push(enemy);
      }

    }
    return arr;
  },


  Wave2: function () {
    var arr = []
    var horizontalGap = 10;
    var verticalGap = 10;
    for (var i = 0; i <= 6; i++) {
      for (var j = 0; j <= 3; j++) {
        if (j == 0) {
          var enemy:Enemy = new EnemyBoss(new CartesianCoordinate(10 + i * (Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Enemy.DEFAULT_HEIGHT + verticalGap))));
        } else {
          enemy = new EnemyGrunt(new CartesianCoordinate(10 + i * (Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Enemy.DEFAULT_HEIGHT + verticalGap))));
        }
        enemy.vector.xVelocity = Enemy.DEFAULT_HORIZONTAL_SPEED;
        arr.push(enemy);
      }
    }
    return arr;
  },

  Wave3: function () {
    var arr = []
    var horizontalGap = 10;
    var verticalGap = 10;
    for (var i = 0; i <= 8; i++) {
      for (var j = 0; j <= 3; j++) {
        if (j == 0 || j === 1) {
          var enemy:Enemy = new EnemyBoss(new CartesianCoordinate(10 + i * (Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Enemy.DEFAULT_HEIGHT + verticalGap))));
        } else {
          enemy = new EnemyGrunt(new CartesianCoordinate(10 + i * (Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Enemy.DEFAULT_HEIGHT + verticalGap))));
        }
        enemy.vector.xVelocity = Enemy.DEFAULT_HORIZONTAL_SPEED;
        arr.push(enemy);
      }
    }
    return arr;
  },

  Wave4: function () {
    var arr = []
    var horizontalGap = 10;
    var verticalGap = 10;
    for (var i = 0; i <= 7; i++) {
      for (var j = 0; j <= 2; j++) {
        var enemy:Enemy = new EnemyBoss(new CartesianCoordinate(10 + i * (Enemy.DEFAULT_WIDTH + horizontalGap), (j * (Enemy.DEFAULT_HEIGHT + verticalGap))));
        enemy.vector.xVelocity = Enemy.DEFAULT_HORIZONTAL_SPEED;
        arr.push(enemy);
      }
    }
    return arr;
  },
  Wave5: function () {

    var arr = []
    var enemy = new EnemyKing(new CartesianCoordinate(10 + (Enemy.DEFAULT_WIDTH ), 10));
    enemy.vector.xVelocity = Enemy.DEFAULT_HORIZONTAL_SPEED;
    arr.push(enemy);
    return arr;

  },
  Wave6: function () {

    var arr = [];
    var horizontalGap = 10;
    var verticalGap = 10;
    for (var i = 0; i < 2; i++) {
      var enemy:Enemy = new EnemyKing(new CartesianCoordinate(10 + i * (EnemyKing.DEFAULT_WIDTH + horizontalGap), 10));
      enemy.vector.xVelocity = Enemy.DEFAULT_HORIZONTAL_SPEED;
      arr.push(enemy);
    }
    return arr;
  },

  Wave7: function () {
    var arr = [];
    var horizontalGap = 10;
    var verticalGap = 10;
    for (var i = 0; i < 2; i++) {
      var enemy:Enemy = new EnemyKing(new CartesianCoordinate(150 + i * (EnemyKing.DEFAULT_WIDTH + horizontalGap), 10));
      enemy.vector.xVelocity = Enemy.DEFAULT_HORIZONTAL_SPEED;
      arr.push(enemy);
    }
    for (var i = 0; i <= 10; i++) {
      for (var j = 0; j <= 3; j++) {
        var enemy:Enemy;
        enemy = new EnemyGrunt(new CartesianCoordinate(10 + i * (Enemy.DEFAULT_WIDTH + horizontalGap), (verticalGap + EnemyKing.DEFAULT_HEIGHT + j * (Enemy.DEFAULT_HEIGHT + verticalGap))));
        enemy.vector.xVelocity = Enemy.DEFAULT_HORIZONTAL_SPEED;
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
      var enemy:Enemy = new EnemyKing(new CartesianCoordinate(150 + i * (EnemyKing.DEFAULT_WIDTH + horizontalGap), 10));
      enemy.vector.xVelocity = Enemy.DEFAULT_HORIZONTAL_SPEED;
      arr.push(enemy);
    }
    for (var i = 0; i <= 12; i++) {
      for (var j = 0; j <= 2; j++) {
        var enemy:Enemy;
        enemy = new EnemyBoss(new CartesianCoordinate(10 + i * (Enemy.DEFAULT_WIDTH + horizontalGap), (verticalGap + EnemyKing.DEFAULT_HEIGHT + j * (Enemy.DEFAULT_HEIGHT + verticalGap))));
        enemy.vector.xVelocity = Enemy.DEFAULT_HORIZONTAL_SPEED;
        arr.push(enemy);
      }
    }
    return arr;
  }
}
