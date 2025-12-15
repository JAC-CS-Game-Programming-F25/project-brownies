import GameEntity from "./GameEntity.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, input, spriteManager } from "../globals.js";
import Input from "../../lib/Input.js";
import Bullet from "./Bullet.js";
import Explosion from "./Explosion.js";

export default class Player extends GameEntity {
	static WIDTH = 32;  // Sprite width
	static HEIGHT = 72; // Keep same height for positioning (sprite may be different size but position stays same)
	static SPEED = 250;
	static SHOOT_COOLDOWN = 0.3;
	static SPRITE_SCALE = 2.0; // Scale sprites 2x

	constructor(x, y) {
		super(x, y, Player.WIDTH, Player.HEIGHT);
		this.speed = Player.SPEED;
		this.lives = 3;
		this.shootCooldown = 0;
		this.isInvincible = false;
		this.invincibilityTimer = 0;
		this.bullets = [];
	}

	update(dt) {
		this.handleMovement(dt);
		this.handleShooting(dt);
		this.updateBullets(dt);
		this.updateInvincibility(dt);

		// Keep player on screen
		this.position.x = Math.max(0, Math.min(this.position.x, CANVAS_WIDTH - this.dimensions.x));
	}

	handleMovement(dt) {
		this.velocity.x = 0;

		if (input.isKeyHeld(Input.KEYS.A) || input.isKeyHeld(Input.KEYS.ARROW_LEFT)) {
			this.velocity.x = -this.speed;
		}
		if (input.isKeyHeld(Input.KEYS.D) || input.isKeyHeld(Input.KEYS.ARROW_RIGHT)) {
			this.velocity.x = this.speed;
		}

		super.update(dt);
	}

	handleShooting(dt) {
		this.shootCooldown = Math.max(0, this.shootCooldown - dt);

		if ((input.isKeyHeld(Input.KEYS.SPACE) || input.isKeyHeld(Input.KEYS.W) || input.isKeyHeld(Input.KEYS.ARROW_UP)) 
			&& this.shootCooldown <= 0) {
			this.shoot();
		}
	}

	shoot() {
		const bulletX = this.position.x + this.dimensions.x / 2 - 2;
		const bulletY = this.position.y;
		this.bullets.push(new Bullet(bulletX, bulletY, true));
		this.shootCooldown = Player.SHOOT_COOLDOWN;
	}

	updateBullets(dt) {
		this.bullets.forEach(bullet => bullet.update(dt));
		this.bullets = this.bullets.filter(bullet => !bullet.shouldCleanUp);
	}

	updateInvincibility(dt) {
		if (this.isInvincible) {
			this.invincibilityTimer -= dt;
			if (this.invincibilityTimer <= 0) {
				this.isInvincible = false;
			}
		}
	}

	render() {
		// Blink when invincible
		if (this.isInvincible && Math.floor(this.invincibilityTimer * 10) % 2 === 0) {
			return;
		}

		// Try to use main ship sprite
		if (spriteManager && spriteManager.isLoaded()) {
			// Offset sprite downward to align with explosion position
			// The explosion appears at position.y + dimensions.y/2 (center of logical position)
			// We offset the sprite so its visual center aligns with that point
			// Adjust this offset value if needed to fine-tune alignment
			const spriteYOffset = 36; // Adjust this value to align sprite with explosion
			const spriteY = this.position.y + spriteYOffset;
			
			const rendered = spriteManager.draw('mainShip', 
				Math.floor(this.position.x), 
				Math.floor(spriteY), 
				Player.SPRITE_SCALE // Scale sprites 2x
			);
			if (rendered) {
				this.bullets.forEach(bullet => bullet.render());
				return;
			}
		}
		
		// Fallback to rectangle
		this.renderRectangle('#00FFFF');
		this.bullets.forEach(bullet => bullet.render());
	}

	hit() {
		if (this.isInvincible) return;

		this.lives--;
		// Don't respawn immediately - let PlayState handle explosion first
		// PlayState will call respawn() after explosion finishes
		if (this.lives <= 0) {
			this.destroy();
		}
	}
	
	// Get position for explosion
	getExplosionPosition() {
		return {
			x: this.position.x + this.dimensions.x / 2,
			y: this.position.y + this.dimensions.y / 2
		};
	}

	respawn() {
		this.position.x = CANVAS_WIDTH / 2 - this.dimensions.x / 2;
		this.position.y = CANVAS_HEIGHT - this.dimensions.y - 20;
		this.isInvincible = true;
		this.invincibilityTimer = 2.0;
	}

	getLives() {
		return this.lives;
	}

	getBullets() {
		return this.bullets;
	}
}