import EnemyType from "../enums/EnemyType.js";
import BeeEnemy from "../entities/BeeEnemy.js";
import ButterflyEnemy from "../entities/ButterflyEnemy.js";
import BossEnemy from "../entities/BossEnemy.js";
import { CANVAS_WIDTH } from "../globals.js";

export default class EnemyFactory {
	static createEnemy(type, x, y) {
		switch (type) {
			case EnemyType.Bee:
				return new BeeEnemy(x, y);
			case EnemyType.Butterfly:
				return new ButterflyEnemy(x, y);
			case EnemyType.Boss:
				return new BossEnemy(x, y);
			default:
				return new BeeEnemy(x, y);
		}
	}

	static createWave(waveNumber) {
		const enemies = [];
		const cols = 10;
		const rows = 4;
		const spacing = 50;
		const startX = (CANVAS_WIDTH - (cols * spacing)) / 2;
		const startY = 80;

		// Boss row
		for (let col = 0; col < cols; col++) {
			const x = startX + col * spacing;
			const y = startY;
			const enemy = this.createEnemy(EnemyType.Boss, x, y);
			enemy.formationPosition = { x, y };
			enemies.push(enemy);
		}

		// Butterfly rows
		for (let row = 0; row < 2; row++) {
			for (let col = 0; col < cols; col++) {
				const x = startX + col * spacing;
				const y = startY + (row + 1) * spacing;
				const enemy = this.createEnemy(EnemyType.Butterfly, x, y);
				enemy.formationPosition = { x, y };
				enemies.push(enemy);
			}
		}

		// Bee row
		for (let col = 0; col < cols; col++) {
			const x = startX + col * spacing;
			const y = startY + 3 * spacing;
			const enemy = this.createEnemy(EnemyType.Bee, x, y);
			enemy.formationPosition = { x, y };
			enemies.push(enemy);
		}

		// Set entry paths for all enemies and position them at the start
		enemies.forEach((enemy, index) => {
			const entryPath = this.generateEntryPath(enemy, index);
			enemy.setEntryPath(entryPath);
			// Position enemy at the start of the entry path
			if (entryPath.length > 0) {
				enemy.position.x = entryPath[0].x;
				enemy.position.y = entryPath[0].y;
			}
		});

		return enemies;
	}

	static generateEntryPath(enemy, index) {
		const side = index % 2 === 0 ? 'left' : 'right';
		const startX = side === 'left' ? -50 : CANVAS_WIDTH + 50;
		const startY = -50;

		return [
			{ x: startX, y: startY },
			{ x: startX, y: 100 },
			{ x: enemy.formationPosition.x, y: 100 },
			{ x: enemy.formationPosition.x, y: enemy.formationPosition.y }
		];
	}
}