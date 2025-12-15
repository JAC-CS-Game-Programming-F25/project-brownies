import { getRandomPositiveInteger } from "../../lib/Random.js";

export default class FormationController {
	constructor(enemies, wave = 1) {
		this.enemies = enemies;
		this.wave = wave;
		this.formationOffsetX = 0;
		this.formationDirection = 1;
		this.formationSpeed = 20;
		this.diveTimer = 0;
		// Adjust dive interval based on wave (Wave 3 attacks more frequently)
		this.diveInterval = wave >= 3 ? 1.5 : 3.0;
	}

	update(dt) {
		this.updateFormationMovement(dt);
		this.updateDiveLogic(dt);
	}

	updateFormationMovement(dt) {
		// Move formation left and right
		this.formationOffsetX += this.formationSpeed * this.formationDirection * dt;

		if (Math.abs(this.formationOffsetX) > 30) {
			this.formationDirection *= -1;
		}

		// Apply offset to all enemies in formation
		this.enemies.forEach(enemy => {
			if (enemy.state === 'in-formation') {
				// Update formation position with offset
				enemy.position.x = enemy.formationPosition.x + this.formationOffsetX;
				// Keep formation Y position
				if (Math.abs(enemy.position.y - enemy.formationPosition.y) < 5) {
					enemy.position.y = enemy.formationPosition.y;
				}
			}
		});
	}

	updateDiveLogic(dt) {
		this.diveTimer += dt;

		if (this.diveTimer >= this.diveInterval) {
			this.triggerRandomDive();
			this.diveTimer = 0;
		}
	}

	triggerRandomDive() {
		const formationEnemies = this.enemies.filter(e => e.state === 'in-formation');
		
		if (formationEnemies.length > 0) {
			const randomEnemy = formationEnemies[getRandomPositiveInteger(0, formationEnemies.length - 1)];
			randomEnemy.triggerAttack();
		}
	}

	addEnemy(enemy) {
		this.enemies.push(enemy);
	}

	removeEnemy(enemy) {
		const index = this.enemies.indexOf(enemy);
		if (index > -1) {
			this.enemies.splice(index, 1);
		}
	}

	isWaveCleared() {
		return this.enemies.length === 0;
	}

	getEnemies() {
		return this.enemies;
	}
}