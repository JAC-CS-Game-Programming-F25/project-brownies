import GameEntity from "./GameEntity.js";
import { CANVAS_HEIGHT, spriteManager } from "../globals.js";

export default class Bullet extends GameEntity {
	/**
	 * @param {number} x 
	 * @param {number} y 
	 * @param {boolean} fromPlayer - true if shot by player, false if by enemy
	 * @param {number} directionX - -1 for left, 0 for straight, 1 for right (player bullets only)
	 */
	constructor(x, y, fromPlayer = true, directionX = 0) {
		super(x, y, 4, 12);
		this.fromPlayer = fromPlayer;
		this.speed = 400;
		
		if (fromPlayer) {
			// Player bullets: can go straight or diagonal
			if (directionX !== 0) {
				// Diagonal shot: use 45-degree angle
				const diagonalSpeed = this.speed * 0.707; // cos(45°) = sin(45°) ≈ 0.707
				this.velocity.x = directionX * diagonalSpeed;
				this.velocity.y = -diagonalSpeed;
			} else {
				// Straight up
				this.velocity.x = 0;
				this.velocity.y = -this.speed;
			}
		} else {
			// Enemy bullets: always straight down
			this.velocity.x = 0;
			this.velocity.y = this.speed;
		}
		
		this.color = fromPlayer ? '#00FF00' : '#FF0000';
	}

	update(dt) {
		super.update(dt);

		// Clean up if off screen
		if (this.isOffScreen()) {
			this.destroy();
		}
	}

	render() {
		// Always use rectangle for bullets (no dedicated bullet sprite)
		this.renderRectangle(this.color);
	}

	onCollision(other) {
		this.destroy();
	}
}