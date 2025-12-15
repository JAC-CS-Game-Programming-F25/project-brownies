import Enemy from "./Enemy.js";
import EnemyType from "../enums/EnemyType.js";

export default class PurpleAlienEnemy extends Enemy {
	constructor(x, y) {
		super(x, y, EnemyType.PurpleAlien, 150);
		this.color = '#AA00FF'; // Purple
		// Use purple down animation with entry and idle
		this.entryAnimationName = 'enemyPurpleDownEntry';
		this.idleAnimationName = 'enemyPurpleDownIdle';
		this.animationName = null; // Not used when entry/idle are set
	}
}

