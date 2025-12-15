import GameEntity from "./GameEntity.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, input, spriteManager, sounds } from "../globals.js";
import Input from "../../lib/Input.js";
import Bullet from "./Bullet.js";
import Explosion from "./Explosion.js";
import { isAABBCollision } from "../../lib/Collision.js";

/**
 * Player - The player's ship entity
 * 
 * This class manages all player-related functionality including:
 * - Movement (left/right using arrow keys or WASD)
 * - Shooting (spacebar or up arrow)
 * - Gun upgrade system (starts at level 1, upgrades to level 2 at 10000 points)
 *   - Level 1: Single shot straight up
 *   - Level 2: Two-way diagonal shot
 * - Lives system (starts with 3 lives)
 * - Invincibility frames after taking damage (2 seconds of blinking)
 * - Collision detection with tighter hitbox (reduced front padding for better feel)
 * 
 * The player sprite is drawn using the mainShip sprite from SpriteManager,
 * which is scaled 2x for better visibility. The logical position (for collisions)
 * and visual position (for sprite rendering) are offset to align properly.
 */
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
		this.gunLevel = 1; // Starts at level 1, can upgrade to 2
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
		const centerX = this.position.x + this.dimensions.x / 2 - 2;
		const bulletY = this.position.y;
		
		if (this.gunLevel >= 2) {
			// 2-way shot: shoot diagonal left and right
			this.bullets.push(new Bullet(centerX - 8, bulletY, true, -1)); // Left diagonal
			this.bullets.push(new Bullet(centerX + 8, bulletY, true, 1));  // Right diagonal
		} else {
			// Level 1: single shot straight up
			this.bullets.push(new Bullet(centerX, bulletY, true, 0));
		}
		
		// Play gunshot sound
		if (sounds) {
			sounds.play('gunSound');
		}
		
		this.shootCooldown = Player.SHOOT_COOLDOWN;
	}
	
	upgradeGun() {
		if (this.gunLevel < 2) {
			this.gunLevel = 2;
		}
	}
	
	getGunLevel() {
		return this.gunLevel;
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
	
	didCollideWithEntity(entity) {
		// Use AABB collision with tighter hitbox for player
		// Reduce the hitbox from the front (top) to match sprite better
		const frontHitboxPadding = 20; // Padding to reduce front hitbox
		
		// Create tighter AABB hitbox for player (reduced from top)
		const playerHitboxX = this.position.x;
		const playerHitboxY = this.position.y + frontHitboxPadding;
		const playerHitboxWidth = this.dimensions.x;
		const playerHitboxHeight = this.dimensions.y - frontHitboxPadding;
		
		// If entity is Enemy, use its tighter hitbox too
		if (entity.didCollideWithEntity && entity.constructor.name === 'Enemy') {
			const enemyHitboxPadding = 8;
			const enemyHitboxX = entity.position.x + enemyHitboxPadding;
			const enemyHitboxY = entity.position.y + enemyHitboxPadding;
			const enemyHitboxWidth = entity.dimensions.x - (enemyHitboxPadding * 2);
			const enemyHitboxHeight = entity.dimensions.y - (enemyHitboxPadding * 2);
			
			return isAABBCollision(
				playerHitboxX, playerHitboxY, playerHitboxWidth, playerHitboxHeight,
				enemyHitboxX, enemyHitboxY, enemyHitboxWidth, enemyHitboxHeight
			);
		}
		
		// For other entities, use standard AABB collision
		return isAABBCollision(
			playerHitboxX, playerHitboxY, playerHitboxWidth, playerHitboxHeight,
			entity.position.x, entity.position.y, entity.dimensions.x, entity.dimensions.y
		);
	}
}