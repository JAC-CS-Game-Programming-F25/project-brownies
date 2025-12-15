import GameEntity from "./GameEntity.js";
import { spriteManager } from "../globals.js";

/**
 * Explosion - Visual effect for entity destruction
 * 
 * This class handles the explosion animation that plays when entities
 * (player or enemies) are destroyed. Both player and enemy explosions
 * use the same 7-frame animation sequence, but are scaled differently.
 * 
 * Animation Details:
 * - Uses the 'enemyExplode' animation (7 frames, 192×192 pixels each)
 * - Scaled down to 0.5x (96×96 pixels) to match entity sizes
 * - Duration: 0.49 seconds (7 frames × 0.07s per frame)
 * - Plays once then automatically destroys itself
 * 
 * The explosion is centered on the position where it was created,
 * which is typically the center of the destroyed entity.
 */
export default class Explosion extends GameEntity {
	constructor(x, y, type = 'player') {
		// Use the same explosion animation for both player and enemy
		// 192×192 sprites, scaled 0.5x = 96×96
		super(x, y, 96, 96);
		
		this.type = type; // 'player' or 'enemy' (kept for reference, but both use same animation now)
		this.animName = 'enemyExplode'; // Both player and enemy use the same 7-frame explosion
		this.duration = 0.49; // 7 frames * 0.07s = 0.49s total
		this.frameCount = 7;
		
		this.timer = 0;
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
		const frameIndex = Math.min(this.frameCount - 1, Math.floor((this.timer / this.duration) * this.frameCount));
		const frameNames = spriteManager.getAnimation(this.animName);
		
		if (frameNames && frameNames[frameIndex]) {
			// Both player and enemy use the same explosion animation
			// Center the explosion on the position (192×192 sprite, scaled down to 0.5x = 96×96)
			const scale = 0.5; // Scale down to match entity size
			const spriteSize = 192 * scale; // 96px
			spriteManager.draw(frameNames[frameIndex],
				Math.floor(this.position.x - spriteSize / 2), // Center horizontally
				Math.floor(this.position.y - spriteSize / 2), // Center vertically
				scale // Scale down
			);
		}
	}
	
	isFinished() {
		return this.isComplete;
	}
}

