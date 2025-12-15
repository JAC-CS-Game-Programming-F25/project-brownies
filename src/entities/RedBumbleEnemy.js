import Enemy from "./Enemy.js";
import EnemyType from "../enums/EnemyType.js";

export default class RedBumbleEnemy extends Enemy {
	constructor(x, y) {
		super(x, y, EnemyType.RedBumble, 200);
		this.color = '#FF0000'; // Red
		// Use red NEW animation (only uses redNEW sprite sheet, loops frames 0-1)
		this.animationName = 'enemyRedBumble';
	}
}

