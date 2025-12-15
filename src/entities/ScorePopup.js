import GameEntity from "./GameEntity.js";
import { context } from "../globals.js";

/**
 * ScorePopup - Floating score text effect
 * 
 * This class creates a "juice" effect that displays score values when
 * enemies are destroyed. The popup:
 * - Appears at the enemy's death position
 * - Floats upward over 1 second (moves 30 pixels per second)
 * - Fades out gradually using alpha transparency
 * - Displays the score value in green text with "+" prefix (e.g., "+100")
 * 
 * This provides immediate visual feedback to the player, making the
 * game feel more responsive and satisfying. The popup automatically
 * destroys itself after the animation completes.
 */
export default class ScorePopup extends GameEntity {
	constructor(x, y, points) {
		super(x, y, 0, 0);
		this.points = points;
		this.timer = 0;
		this.duration = 1.0; // 1 second lifetime
		this.startY = y;
		this.alpha = 1.0;
	}
	
	update(dt) {
		this.timer += dt;
		
		// Move upward
		this.position.y = this.startY - (this.timer * 30); // Move up 30 pixels per second
		
		// Fade out
		this.alpha = Math.max(0, 1.0 - (this.timer / this.duration));
		
		if (this.timer >= this.duration) {
			this.destroy();
		}
	}
	
	render() {
		context.save();
		context.globalAlpha = this.alpha;
		context.fillStyle = "#00FF00"; // Green for score
		context.font = "bold 24px Orbitron";
		context.textAlign = "center";
		context.fillText(`+${this.points}`, this.position.x, this.position.y);
		context.restore();
	}
}

