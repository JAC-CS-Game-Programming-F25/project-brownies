import Enemy from "./Enemy.js";
import EnemyType from "../enums/EnemyType.js";

export default class BossEnemy extends Enemy {
	static WIDTH = 40;
	static HEIGHT = 40;

	constructor(x, y) {
		super(x, y, EnemyType.Boss, 300);
		this.dimensions.x = BossEnemy.WIDTH;
		this.dimensions.y = BossEnemy.HEIGHT;
		this.color = '#FF0000'; // Red
	}
}