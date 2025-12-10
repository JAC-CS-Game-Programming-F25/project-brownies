import Vector from "../../lib/Vector.js";
import { context } from "../globals.js";

export default class GameEntity {
	/**
	 * Base class for all game entities (Player, Enemy, Bullet, PowerUp)
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} width 
	 * @param {number} height 
	 */
	constructor(x = 0, y = 0, width = 16, height = 16) {
		this.position = new Vector(x, y);
		this.dimensions = new Vector(width, height);
		this.velocity = new Vector(0, 0);
		this.sprites = [];
		this.currentFrame = 0;
		this.isActive = true;
		this.shouldCleanUp = false;
	}

	update(dt) {
		this.position.add(this.velocity, dt);
	}

	render() {
		if (this.sprites[this.currentFrame]) {
			this.sprites[this.currentFrame].render(
				Math.floor(this.position.x),
				Math.floor(this.position.y)
			);
		} else {
			// Fallback: render a colored rectangle
			this.renderRectangle();
		}
	}

	renderRectangle(color = 'white') {
		context.save();
		context.fillStyle = color;
		context.fillRect(
			Math.floor(this.position.x),
			Math.floor(this.position.y),
			this.dimensions.x,
			this.dimensions.y
		);
		context.restore();
	}

	didCollideWithEntity(entity) {
		return this.position.x < entity.position.x + entity.dimensions.x
			&& this.position.x + this.dimensions.x > entity.position.x
			&& this.position.y < entity.position.y + entity.dimensions.y
			&& this.position.y + this.dimensions.y > entity.position.y;
	}

	isOffScreen() {
		return this.position.x + this.dimensions.x < 0
			|| this.position.x > context.canvas.width
			|| this.position.y + this.dimensions.y < 0
			|| this.position.y > context.canvas.height;
	}

	onCollision(other) {
		// Override in subclasses
	}

	destroy() {
		this.shouldCleanUp = true;
		this.isActive = false;
	}
}