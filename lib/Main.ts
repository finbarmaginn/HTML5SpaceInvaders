import Game from "./Game";

var game = new Game();

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


//todo move this to common?
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
interface Number {
  clamp(min, max): number;
}


Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
