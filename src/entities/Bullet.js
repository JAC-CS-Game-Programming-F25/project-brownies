import GameEntity from "./GameEntity.js";
import { CANVAS_HEIGHT, spriteManager } from "../globals.js";

/**
 * Bullet - Projectile fired by player or enemies
 * 
 * This class handles both player and enemy bullets with different behaviors:
 * 
 * Player Bullets:
 * - Can fire straight up (gun level 1) or diagonal left/right (gun level 2)
 * - Green color (#00FF00)
 * - Speed: 400 pixels/second
 * - Diagonal bullets use 45-degree angle with reduced speed component (cos(45°) ≈ 0.707)
 * 
 * Enemy Bullets:
 * - Always fire straight down
 * - Red color (#FF0000)
 * - Same speed as player bullets for consistency
 * 
 * Bullets automatically destroy themselves when they go off-screen to prevent
 * memory leaks. They're rendered as simple colored rectangles (no sprite).
 */
export default class Bullet extends GameEntity {
	/**
	 * Creates a new bullet
	 * 
	 * @param {number} x - Starting X position (center of shooter)
	 * @param {number} y - Starting Y position
	 * @param {boolean} fromPlayer - true if shot by player, false if shot by enemy
	 * @param {number} directionX - For player bullets: -1 = left diagonal, 0 = straight, 1 = right diagonal
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