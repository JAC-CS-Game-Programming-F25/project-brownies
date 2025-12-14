import GameEntity from "./GameEntity.js";
import { spriteManager } from "../globals.js";

/**
 * Explosion effect that plays an animation and then destroys itself
 */
export default class Explosion extends GameEntity {
	constructor(x, y, type = 'player') {
		// Explosion sprites are 32x52, scaled 2x = 64x104
		super(x, y, 64, 104);
		this.type = type; // 'player' or 'enemy'
		this.animName = type === 'enemy' ? 'enemyExplode' : 'explode';
		this.timer = 0;
		this.duration = 0.4; // 4 frames * 0.1s = 0.4s total
		this.isComplete = false;
	}
	
	update(dt) {
		this.timer += dt;
		if (this.timer >= this.duration) {
			this.isComplete = true;
			this.destroy();
		}
	}
	
	render() {
		if (!spriteManager || !spriteManager.isLoaded() || this.isComplete) {
			return;
		}
		
		// Get current frame based on timer (clamp to prevent going past last frame)
		const frameIndex = Math.min(3, Math.floor((this.timer / this.duration) * 4));
		const frameNames = spriteManager.getAnimation(this.animName);
		
		if (frameNames && frameNames[frameIndex]) {
			// Center the explosion on the position
			spriteManager.draw(frameNames[frameIndex],
				Math.floor(this.position.x - 32), // Center horizontally (sprite is 32px wide, scaled 2x = 64px)
				Math.floor(this.position.y - 52), // Center vertically (sprite is 52px tall, scaled 2x = 104px)
				2.0 // Scale 2x
			);
		}
	}
	
	isFinished() {
		return this.isComplete;
	}
}

