import Enemy from "./Enemy.js";
import EnemyType from "../enums/EnemyType.js";

export default class BeeEnemy extends Enemy {
	constructor(x, y) {
		super(x, y, EnemyType.Bee, 100);
		this.color = '#FFFF00'; // Yellow
	}
}