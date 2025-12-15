import Enemy from "./Enemy.js";
import EnemyType from "../enums/EnemyType.js";

export default class YellowAlienEnemy extends Enemy {
	constructor(x, y) {
		super(x, y, EnemyType.YellowAlien, 100);
		this.color = '#FFFF00'; // Yellow
		// Use yellow down animation with entry and idle
		this.entryAnimationName = 'enemyYellowDownEntry';
		this.idleAnimationName = 'enemyYellowDownIdle';
		this.animationName = null; // Not used when entry/idle are set
	}
}

