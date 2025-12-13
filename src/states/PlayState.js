import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import EnemyFactory from "../services/EnemyFactory.js";
import FormationController from "../services/FormationController.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, input, stateMachine } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class PlayState extends State {
	constructor() {
		super();
	}

	enter(parameters = {}) {
		// Game data
		this.score = parameters.score ?? 0;
		this.wave = parameters.wave ?? 1;

		// Create player
		this.player = new Player(
			CANVAS_WIDTH / 2 - 16,
			CANVAS_HEIGHT - 60
		);

		// Create enemies
		this.enemies = EnemyFactory.createWave(this.wave);
		this.formationController = new FormationController(this.enemies);

		// Pause flag
		this.isPaused = false;
	}

	update(dt) {
		// Toggle pause
		if (
			input.isKeyPressed(Input.KEYS.P) ||
			input.isKeyPressed(Input.KEYS.ESCAPE)
		) {
			this.isPaused = !this.isPaused;
		}

		// Quit to title while paused
		if (this.isPaused && input.isKeyPressed(Input.KEYS.Q)) {
			stateMachine.change(GameStateName.TitleScreen);
			return;
		}

		// STOP ALL GAME UPDATES WHILE PAUSED
		if (this.isPaused) {
			return;
		}

		if (input.isKeyPressed(Input.KEYS.Q)){
			stateMachine.change(GameStateName.TitleScreen);
			return;
		}

		// DEBUG: force victory
		if (input.isKeyPressed(Input.KEYS.V)) {
			stateMachine.change(GameStateName.Victory);
			return;
		}

		// Update gameplay
		this.player.update(dt);
		this.formationController.update(dt);
		this.enemies.forEach(enemy => enemy.update(dt));

		this.checkCollisions();
		this.cleanupEntities();

		// Wave cleared -> next wave
		if (this.formationController.isWaveCleared()) {
			if (this.wave >= 3) { // pick any final wave number
				stateMachine.change(GameStateName.Victory);
			} else {
				stateMachine.change(GameStateName.WaveComplete, {
					wave: this.wave,
					score: this.score
				});
				return;
			}
		}

		// Game over
		if (this.player.getLives() <= 0) {
			stateMachine.change(GameStateName.GameOver, {
				score: this.score
			});
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
		this.enter({
			score: this.score,
			wave: this.wave
		});
	}

	render() {
		this.renderBackground();
		this.player.render();
		this.enemies.forEach(enemy => enemy.render());
		this.renderHUD();

		if (this.isPaused) {
			this.renderPauseOverlay();
		}
	}

	renderBackground() {
		context.fillStyle = "black";
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	renderHUD() {
		context.save();
		context.fillStyle = "white";
		context.font = "20px Arial";
		context.fillText(`SCORE: ${this.score}`, 10, 30);
		context.fillText(`LIVES: ${this.player.getLives()}`, CANVAS_WIDTH - 120, 30);
		context.fillText(`WAVE: ${this.wave}`, CANVAS_WIDTH / 2 - 40, 30);
		context.restore();
	}

	renderPauseOverlay() {
		context.save();
		context.fillStyle = "rgba(0,0,0,0.8)";
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		context.fillStyle = "#FFFF00";
		context.font = "bold 48px Arial";
		context.textAlign = "center";
		context.fillText("PAUSED", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);

		context.font = "24px Arial";
		context.fillStyle = "white";
		context.fillText("P / ESC  —  Resume", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
		context.fillText("Q  —  Quit to Title", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);

		context.restore();
	}
}