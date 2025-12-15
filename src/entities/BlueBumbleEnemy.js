import Enemy from "./Enemy.js";
import EnemyType from "../enums/EnemyType.js";

export default class BlueBumbleEnemy extends Enemy {
	constructor(x, y) {
		super(x, y, EnemyType.BlueBumble, 150);
		this.color = '#0088FF'; // Blue
		// Use blue NEW animation (only uses blueNEW sprite sheet, loops frames 0-1)
		this.animationName = 'enemyBlueBumble';
	}
}

