import Enemy from "./Enemy.js";
import EnemyType from "../enums/EnemyType.js";

export default class ButterflyEnemy extends Enemy {
	constructor(x, y) {
		super(x, y, EnemyType.Butterfly, 150);
		this.color = '#FF00FF'; // Magenta
	}
}