import Enemy from "./Enemy.js";
import EnemyType from "../enums/EnemyType.js";
import { spriteManager } from "../globals.js";

export default class BossEnemy extends Enemy {
	static WIDTH = 40;  // Sprite is 16x36, scaled 2.5x = 40x90
	static HEIGHT = 90; // Match scaled sprite height
	static SPRITE_SCALE = 2.5; // Scale sprites 2.5x for boss

	constructor(x, y) {
		super(x, y, EnemyType.Boss, 300);
		this.dimensions.x = BossEnemy.WIDTH;
		this.dimensions.y = BossEnemy.HEIGHT;
		this.color = '#FF0000'; // Red
		this.animationName = 'bossFly'; // Use boss/butterfly animation
	}

	render() {
		// Try to use sprite animation (Boss uses red enemy sprites)
		if (spriteManager && spriteManager.isLoaded() && this.animationName) {
			const rendered = spriteManager.drawAnimation(this.animationName,
				Math.floor(this.position.x),
				Math.floor(this.position.y),
				BossEnemy.SPRITE_SCALE // Scale sprites 2.5x for boss
			);
			if (rendered) {
				return;
			}
		}
		
		// Fallback to rectangle
		this.renderRectangle(this.color);
	}
}