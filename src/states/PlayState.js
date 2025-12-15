import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import EnemyFactory from "../services/EnemyFactory.js";
import FormationController from "../services/FormationController.js";
import Explosion from "../entities/Explosion.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, input, stateMachine, spriteManager } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class PlayState extends State {
	constructor() {
		super();
		this.backgroundImage = new Image();
		this.backgroundImage.src = './assets/images/background.png';
		this.backgroundLoaded = false;
		
		this.backgroundImage.onload = () => {
			this.backgroundLoaded = true;
		};
	}

	enter(parameters = {}) {
		// Game data
		this.score = parameters.score ?? 0;
		this.wave = parameters.wave ?? 1;

		// Create player (centered horizontally, near bottom of screen)
		this.player = new Player(
			CANVAS_WIDTH / 2 - Player.WIDTH / 2,
			CANVAS_HEIGHT - Player.HEIGHT - 20
		);

		// Create enemies
		this.enemies = EnemyFactory.createWave(this.wave);
		this.formationController = new FormationController(this.enemies);

		// Pause flag
		this.isPaused = false;
		
		// Explosions
		this.explosions = [];
		this.playerExplosion = null;
		this.waitingForPlayerExplosion = false;
		this.playerDied = false; // Track if player is completely dead
		this.playerExplosionCreated = false; // Prevent recreation
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

		// Update sprite animations
		if (spriteManager) {
			spriteManager.update(dt);
		}

		// Update gameplay
		if (!this.waitingForPlayerExplosion) {
			this.player.update(dt);
		}
		this.formationController.update(dt);
		this.enemies.forEach(enemy => enemy.update(dt));
		
		// Update explosions
		this.explosions.forEach(explosion => explosion.update(dt));
		if (this.playerExplosion) {
			this.playerExplosion.update(dt);
			if (this.playerExplosion.isFinished() || this.playerExplosion.shouldCleanUp) {
				// If player is dead, go to game over immediately
				if (this.playerDied) {
					this.playerExplosion = null;
					this.waitingForPlayerExplosion = false;
					stateMachine.change(GameStateName.GameOver, {
						score: this.score
					});
					return; // Exit update - state is changing
				}
				// Otherwise, player lost a life but can continue - respawn and continue
				this.playerExplosion = null;
				this.waitingForPlayerExplosion = false;
				if (this.player.getLives() > 0) {
					this.player.respawn();
				}
			}
		}

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

		// Check if player died and create explosion (only once)
		if (this.player.getLives() <= 0 && !this.playerExplosion && !this.waitingForPlayerExplosion && !this.playerExplosionCreated) {
			const explosionPos = this.player.getExplosionPosition();
			this.playerExplosion = new Explosion(explosionPos.x, explosionPos.y, 'player');
			this.waitingForPlayerExplosion = true;
			this.playerDied = true;
			this.playerExplosionCreated = true; // Mark as created to prevent recreation
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
					// Create explosion at enemy position
					const explosion = new Explosion(
						enemy.position.x + enemy.dimensions.x / 2,
						enemy.position.y + enemy.dimensions.y / 2,
						'enemy'
					);
					this.explosions.push(explosion);
					
					bullet.onCollision(enemy);
					enemy.onCollision(bullet);
					this.score += enemy.getPoints();
				}
			});
		});

		// Player vs enemies
		if (!this.player.isInvincible && !this.waitingForPlayerExplosion) {
			this.enemies.forEach(enemy => {
				if (!enemy.isActive) return;

				if (this.player.didCollideWithEntity(enemy)) {
					// Create explosion at enemy position
					const explosion = new Explosion(
						enemy.position.x + enemy.dimensions.x / 2,
						enemy.position.y + enemy.dimensions.y / 2,
						'enemy'
					);
					this.explosions.push(explosion);
					
					enemy.destroy();
					
					// Check if player will lose a life
					const livesBeforeHit = this.player.getLives();
					this.player.hit();
					const livesAfterHit = this.player.getLives();
					
					// If player lost a life (but not dead), create explosion
					if (livesAfterHit < livesBeforeHit && livesAfterHit > 0 && !this.playerExplosion) {
						const explosionPos = this.player.getExplosionPosition();
						this.playerExplosion = new Explosion(explosionPos.x, explosionPos.y, 'player');
						this.waitingForPlayerExplosion = true;
					}
				}
			});
		}
	}

	cleanupEntities() {
		this.enemies = this.enemies.filter(enemy => !enemy.shouldCleanUp);
		this.formationController.enemies = this.enemies;
		this.explosions = this.explosions.filter(explosion => !explosion.shouldCleanUp);
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
		
		// Render player if not waiting for explosion
		if (!this.waitingForPlayerExplosion) {
			this.player.render();
		}
		
		this.enemies.forEach(enemy => enemy.render());
		
		// Render explosions
		this.explosions.forEach(explosion => explosion.render());
		if (this.playerExplosion) {
			this.playerExplosion.render();
		}
		
		this.renderHUD();

		if (this.isPaused) {
			this.renderPauseOverlay();
		}
	}

	renderBackground() {
		// Background image
		if (this.backgroundLoaded && this.backgroundImage.complete) {
			context.drawImage(this.backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		} else {
			// Fallback black background while loading
			context.fillStyle = "black";
			context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		}
	}

	renderHUD() {
		context.save();
		context.fillStyle = "white";
		context.font = "bold 20px Orbitron";
		context.textAlign = "center";
		
		// Center all HUD elements at the top
		const hudY = 30;
		const thirdWidth = CANVAS_WIDTH / 3;
		
		// SCORE: left third, centered
		context.fillText(`SCORE: ${this.score}`, thirdWidth / 2, hudY);
		
		// WAVE: middle third, centered
		context.fillText(`WAVE: ${this.wave}`, CANVAS_WIDTH / 2, hudY);
		
		// LIVES: right third, centered
		context.fillText(`LIVES: ${this.player.getLives()}`, CANVAS_WIDTH - thirdWidth / 2, hudY);
		
		context.restore();
	}

	renderPauseOverlay() {
		context.save();
		context.fillStyle = "rgba(0,0,0,0.8)";
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		context.fillStyle = "#FFFF00";
		context.font = "900 48px Orbitron";
		context.textAlign = "center";
		context.fillText("PAUSED", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);

		context.font = "bold 24px Orbitron";
		context.fillStyle = "white";
		context.fillText("P / ESC  —  Resume", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
		context.fillText("Q  —  Quit to Title", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);

		context.restore();
	}
}