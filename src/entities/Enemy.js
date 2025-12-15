import GameEntity from "./GameEntity.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, spriteManager } from "../globals.js";
import Bullet from "./Bullet.js";
import { isAABBCollision } from "../../lib/Collision.js";

export default class Enemy extends GameEntity {
	static WIDTH = 32;  // Sprite width (will vary per frame, but using max width scaled)
	static HEIGHT = 96; // Sprite is 48px height, scaled 2x = 96px (updated for NEW sprites)
	static SPRITE_SCALE = 2.0; // Scale sprites 2x

	constructor(x, y, type, points = 100) {
		super(x, y, Enemy.WIDTH, Enemy.HEIGHT);
		this.type = type;
		this.points = points;
		this.formationPosition = { x, y };
		this.state = 'entering';
		this.entryPath = [];
		this.entryPathIndex = 0;
		this.movementSpeed = 150;
		this.attackSpeed = 250; // Speed when chasing player (Wave 3)
		this.wave1AttackSpeed = 150; // Slower speed for Wave 1
		this.wave2AttackSpeed = 180; // Medium speed for Wave 2
		this.color = '#FF0000';
		this.animationName = null; // Will be set by subclasses
		this.entryAnimationName = null; // For down enemies: entry animation
		this.idleAnimationName = null; // For down enemies: idle animation
		this.entryAnimationComplete = false; // Track if entry animation finished
		
		// Wave and shooting
		this.wave = 1;
		this.player = null; // Will be set by PlayState
		this.bullets = [];
		this.shootCooldown = 0;
		this.shootInterval = 1.0; // Base shooting interval (Wave 2)
		this.attackTimer = 0; // Track how long enemy has been attacking
		this.maxAttackTime = 3.0; // Max time before returning to formation
		this.attackDirection = null; // For Wave 1-2: fixed trajectory direction
		this.hasSetDirection = false; // Track if direction has been set
	}

	update(dt) {
		// Update sprite animations (SpriteManager handles this globally, but we can update here too if needed)
		// The sprite animations are updated in PlayState, so we don't need to do it here

		switch (this.state) {
			case 'entering':
				this.updateEntry(dt);
				break;
			case 'in-formation':
				this.updateFormation(dt);
				break;
			case 'attacking':
				this.updateAttack(dt);
				// Update bullets
				this.updateBullets(dt);
				// Shoot at player (Wave 2+)
				if (this.wave >= 2) {
					this.updateShooting(dt);
				}
				break;
		}

		if (this.isOffScreen() && this.state !== 'entering') {
			this.destroy();
		}
	}

	updateEntry(dt) {
		// Check if entry animation is complete (for down enemies with entry/idle animations)
		if (this.entryAnimationName && spriteManager) {
			const entryAnim = spriteManager.getAnimationObject(this.entryAnimationName);
			if (entryAnim && entryAnim.isDone() && !this.entryAnimationComplete) {
				this.entryAnimationComplete = true;
				// Switch to idle animation
				if (this.idleAnimationName) {
					const idleAnim = spriteManager.getAnimationObject(this.idleAnimationName);
					if (idleAnim) {
						idleAnim.refresh(); // Reset idle animation
					}
				}
			}
		}
		
		if (this.entryPath.length === 0 || this.entryPathIndex >= this.entryPath.length) {
			this.state = 'in-formation';
			this.position.x = this.formationPosition.x;
			this.position.y = this.formationPosition.y;
			this.velocity.x = 0;
			this.velocity.y = 0;
			this.entryAnimationComplete = true; // Entry path complete = entry animation complete
			return;
		}

		const target = this.entryPath[this.entryPathIndex];
		const dx = target.x - this.position.x;
		const dy = target.y - this.position.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < 5) {
			this.entryPathIndex++;
		} else {
			this.velocity.x = (dx / distance) * this.movementSpeed;
			this.velocity.y = (dy / distance) * this.movementSpeed;
			super.update(dt);
		}
	}

	updateFormation(dt) {
		// Move toward formation Y position (X is handled by FormationController)
		const dy = this.formationPosition.y - this.position.y;
		
		if (Math.abs(dy) > 5) {
			// Move toward formation Y position
			this.velocity.y = (dy > 0 ? 1 : -1) * this.movementSpeed;
			super.update(dt);
		} else {
			// Snap to formation Y position
			this.position.y = this.formationPosition.y;
			this.velocity.y = 0;
		}
		
		// X position will be set by FormationController
		this.velocity.x = 0;
	}

	updateAttack(dt) {
		// Chase player position instead of following a path
		if (!this.player) {
			this.returnToFormation();
			return;
		}

		this.attackTimer += dt;
		
		// Return to formation after max attack time
		if (this.attackTimer >= this.maxAttackTime) {
			this.returnToFormation();
			return;
		}

		const playerX = this.player.position.x + this.player.dimensions.x / 2;
		const playerY = this.player.position.y;
		
		// Wave 1-2: Calculate direction once, then follow that trajectory
		// Wave 3: Continuously track player but slower
		if (this.wave <= 2) {
			if (!this.hasSetDirection) {
				// Calculate direction toward player once
				const dx = playerX - (this.position.x + this.dimensions.x / 2);
				const dy = playerY - this.position.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				
				if (distance > 0) {
					// Use slower speeds for Wave 1 and 2
					const speed = this.wave === 1 ? this.wave1AttackSpeed : this.wave2AttackSpeed;
					this.attackDirection = {
						x: (dx / distance) * speed,
						y: (dy / distance) * speed
					};
					this.hasSetDirection = true;
				}
			}
			
			// Follow the fixed trajectory
			if (this.attackDirection) {
				this.velocity.x = this.attackDirection.x;
				this.velocity.y = this.attackDirection.y;
				super.update(dt);
			}
		} else {
			// Wave 3: Continuous tracking but slower
			const dx = playerX - (this.position.x + this.dimensions.x / 2);
			const dy = playerY - this.position.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance > 5) {
				// Move toward player with slower speed for Wave 3
				const slowerSpeed = this.attackSpeed * 0.7; // 30% slower
				this.velocity.x = (dx / distance) * slowerSpeed;
				this.velocity.y = (dy / distance) * slowerSpeed;
				super.update(dt);
			} else {
				// Close enough, return to formation
				this.returnToFormation();
			}
		}
	}
	
	updateShooting(dt) {
		if (this.wave < 2) return; // Only shoot in Wave 2+
		
		this.shootCooldown = Math.max(0, this.shootCooldown - dt);
		
		// Adjust shoot interval based on wave (Wave 3 shoots more frequently)
		const currentInterval = this.wave >= 3 ? this.shootInterval * 0.5 : this.shootInterval;
		
		if (this.shootCooldown <= 0 && this.player) {
			this.shoot();
			this.shootCooldown = currentInterval;
		}
	}
	
	shoot() {
		if (!this.player) return;
		
		const bulletX = this.position.x + this.dimensions.x / 2 - 2;
		const bulletY = this.position.y + this.dimensions.y;
		this.bullets.push(new Bullet(bulletX, bulletY, false));
	}
	
	updateBullets(dt) {
		this.bullets.forEach(bullet => bullet.update(dt));
		this.bullets = this.bullets.filter(bullet => !bullet.shouldCleanUp);
	}

	returnToFormation() {
		this.state = 'in-formation';
		this.attackTimer = 0;
		this.attackDirection = null;
		this.hasSetDirection = false;
		// Let updateFormation handle movement back to formation position
	}

	setEntryPath(path) {
		this.entryPath = path;
		this.entryPathIndex = 0;
	}

	triggerAttack() {
		if (this.state !== 'in-formation') return;

		this.state = 'attacking';
		this.attackTimer = 0; // Reset attack timer
		this.shootCooldown = 0; // Can shoot immediately when attacking
		this.attackDirection = null; // Reset direction
		this.hasSetDirection = false; // Reset direction flag
	}
	
	setPlayer(player) {
		this.player = player;
	}
	
	setWave(wave) {
		this.wave = wave;
	}

	render() {
		// Determine which animation to use (entry/idle for down enemies, or regular animation)
		let animToUse = this.animationName;
		
		// For down enemies: use entry animation until complete, then switch to idle
		if (this.entryAnimationName && this.idleAnimationName) {
			if (this.entryAnimationComplete || this.state === 'in-formation') {
				animToUse = this.idleAnimationName;
			} else {
				animToUse = this.entryAnimationName;
			}
		}
		
		// Try to use sprite animation
		if (spriteManager && animToUse) {
			// Try to render even if not fully loaded (sprites might load later)
			if (spriteManager.isLoaded()) {
				const rendered = spriteManager.drawAnimation(animToUse,
					Math.floor(this.position.x),
					Math.floor(this.position.y),
					Enemy.SPRITE_SCALE // Scale sprites 2x
				);
				if (rendered) {
					// Render bullets
					this.bullets.forEach(bullet => bullet.render());
					return;
				}
			}
		}
		
		// Fallback to rectangle
		this.renderRectangle(this.color);
		// Render bullets
		this.bullets.forEach(bullet => bullet.render());
	}
	
	getBullets() {
		return this.bullets;
	}
	
	didCollideWithEntity(entity) {
		// Use AABB collision with tighter hitbox for enemies
		// Reduce hitbox from all sides to match sprite better
		const hitboxPadding = 8; // Padding to reduce hitbox on all sides
		
		// Create tighter AABB hitbox for enemy (reduced from all sides)
		const enemyHitboxX = this.position.x + hitboxPadding;
		const enemyHitboxY = this.position.y + hitboxPadding;
		const enemyHitboxWidth = this.dimensions.x - (hitboxPadding * 2);
		const enemyHitboxHeight = this.dimensions.y - (hitboxPadding * 2);
		
		// If entity is Player, use its tighter hitbox too
		if (entity.didCollideWithEntity && entity.constructor.name === 'Player') {
			const playerFrontHitboxPadding = 20;
			const playerHitboxX = entity.position.x;
			const playerHitboxY = entity.position.y + playerFrontHitboxPadding;
			const playerHitboxWidth = entity.dimensions.x;
			const playerHitboxHeight = entity.dimensions.y - playerFrontHitboxPadding;
			
			return isAABBCollision(
				enemyHitboxX, enemyHitboxY, enemyHitboxWidth, enemyHitboxHeight,
				playerHitboxX, playerHitboxY, playerHitboxWidth, playerHitboxHeight
			);
		}
		
		// For other entities, use standard AABB collision
		return isAABBCollision(
			enemyHitboxX, enemyHitboxY, enemyHitboxWidth, enemyHitboxHeight,
			entity.position.x, entity.position.y, entity.dimensions.x, entity.dimensions.y
		);
	}

	onCollision(other) {
		this.destroy();
	}

	getPoints() {
		return this.points;
	}
}