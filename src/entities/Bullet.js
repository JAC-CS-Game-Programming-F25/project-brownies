import GameEntity from "./GameEntity.js";
import { CANVAS_HEIGHT, spriteManager } from "../globals.js";

export default class Bullet extends GameEntity {
	/**
	 * @param {number} x 
	 * @param {number} y 
	 * @param {boolean} fromPlayer - true if shot by player, false if by enemy
	 */
	constructor(x, y, fromPlayer = true) {
		super(x, y, 4, 12);
		this.fromPlayer = fromPlayer;
		this.speed = 400;
		this.velocity.y = fromPlayer ? -this.speed : this.speed;
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