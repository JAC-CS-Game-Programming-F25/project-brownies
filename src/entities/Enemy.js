import GameEntity from "./GameEntity.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, spriteManager } from "../globals.js";

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
		this.attackPath = [];
		this.attackPathIndex = 0;
		this.movementSpeed = 150;
		this.color = '#FF0000';
		this.animationName = null; // Will be set by subclasses
		this.entryAnimationName = null; // For down enemies: entry animation
		this.idleAnimationName = null; // For down enemies: idle animation
		this.entryAnimationComplete = false; // Track if entry animation finished
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
		// Enemies in formation can move slightly (handled by FormationController later)
		super.update(dt);
	}

	updateAttack(dt) {
		if (this.attackPath.length === 0 || this.attackPathIndex >= this.attackPath.length) {
			this.state = 'returning';
			this.returnToFormation();
			return;
		}

		const target = this.attackPath[this.attackPathIndex];
		const dx = target.x - this.position.x;
		const dy = target.y - this.position.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < 5) {
			this.attackPathIndex++;
		} else {
			this.velocity.x = (dx / distance) * this.movementSpeed * 1.5;
			this.velocity.y = (dy / distance) * this.movementSpeed * 1.5;
			super.update(dt);
		}
	}

	returnToFormation() {
		this.state = 'in-formation';
		this.velocity.x = 0;
		this.velocity.y = 0;
		this.attackPathIndex = 0;
	}

	setEntryPath(path) {
		this.entryPath = path;
		this.entryPathIndex = 0;
	}

	triggerAttack() {
		if (this.state !== 'in-formation') return;

		this.state = 'attacking';
		this.generateAttackPath();
	}

	generateAttackPath() {
		// Simple dive attack
		this.attackPath = [
			{ x: this.position.x, y: this.position.y + 200 },
			{ x: this.position.x - 100, y: this.position.y + 400 },
			{ x: this.position.x, y: CANVAS_HEIGHT + 50 }
		];
		this.attackPathIndex = 0;
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
					return;
				}
			}
		}
		
		// Fallback to rectangle
		this.renderRectangle(this.color);
	}

	onCollision(other) {
		this.destroy();
	}

	getPoints() {
		return this.points;
	}
}