import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import EnemyFactory from "../services/EnemyFactory.js";
import FormationController from "../services/FormationController.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, input } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class PlayState extends State {
	constructor() {
		super();
	}

	enter(parameters = {}) {
		this.score = parameters.score || 0;
		this.wave = parameters.wave || 1;
		
		this.player = new Player(CANVAS_WIDTH / 2 - 16, CANVAS_HEIGHT - 60);
		this.enemies = EnemyFactory.createWave(this.wave);
		this.formationController = new FormationController(this.enemies);
	}

	update(dt) {
		// Check for pause
		if (input.isKeyPressed(Input.KEYS.ESCAPE) || input.isKeyPressed(Input.KEYS.P)) {
			// TODO: Add pause state
		}

		this.player.update(dt);
		this.formationController.update(dt);
		this.enemies.forEach(enemy => enemy.update(dt));

		this.checkCollisions();
		this.cleanupEntities();

		// Check win condition
		if (this.formationController.isWaveCleared()) {
			this.nextWave();
		}

		// Check game over
		if (this.player.lives <= 0) {
			this.gameOver();
		}
	}

	checkCollisions() {
		const playerBullets = this.player.getBullets();

		// Player bullets vs enemies
		playerBullets.forEach(bullet => {
			if (!bullet.isActive) return;

			this.enemies.forEach(enemy => {
				if (!enemy.isActive) return;

				if (bullet.didCollideWithEntity(enemy)) {
					bullet.onCollision(enemy);
					enemy.onCollision(bullet);
					this.score += enemy.getPoints();
				}
			});
		});

		// Player vs enemies
		if (!this.player.isInvincible) {
			this.enemies.forEach(enemy => {
				if (!enemy.isActive) return;

				if (this.player.didCollideWithEntity(enemy)) {
					enemy.destroy();
					this.player.hit();
				}
			});
		}
	}

	cleanupEntities() {
		this.enemies = this.enemies.filter(enemy => !enemy.shouldCleanUp);
		this.formationController.enemies = this.enemies;
	}

	nextWave() {
		this.wave++;
		// TODO: Add wave complete state or just restart with new wave
		this.enter({ score: this.score, wave: this.wave });
	}

	gameOver() {
		// TODO: Transition to GameOverState with final score
	}

	render() {
		this.renderBackground();
		this.player.render();
		this.enemies.forEach(enemy => enemy.render());
		this.renderHUD();
	}

	renderBackground() {
	context.save();
	context.fillStyle = 'black';
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	context.restore();
}


	renderHUD() {
		context.save();
		context.fillStyle = 'white';
		context.font = '20px Arial';
		context.fillText(`SCORE: ${this.score}`, 10, 30);
		context.fillText(`LIVES: ${this.player.getLives()}`, CANVAS_WIDTH - 120, 30);
		context.fillText(`WAVE: ${this.wave}`, CANVAS_WIDTH / 2 - 40, 30);
		context.restore();
	}
}