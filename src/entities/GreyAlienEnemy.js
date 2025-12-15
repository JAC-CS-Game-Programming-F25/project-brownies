import Enemy from "./Enemy.js";
import EnemyType from "../enums/EnemyType.js";

export default class GreyAlienEnemy extends Enemy {
	constructor(x, y) {
		super(x, y, EnemyType.GreyAlien, 100);
		this.color = '#888888'; // Grey
		// Use grey down animation with entry and idle
		this.entryAnimationName = 'enemyGreyDownEntry';
		this.idleAnimationName = 'enemyGreyDownIdle';
		this.animationName = null; // Not used when entry/idle are set
	}
}

