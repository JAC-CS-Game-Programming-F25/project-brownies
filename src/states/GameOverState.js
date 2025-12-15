import State from "../../lib/State.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, input, stateMachine, sounds } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

const MAX_INITIALS = 3;

export default class GameOverState extends State {
	constructor() {
		super();
		this.backgroundImage = new Image();
		this.backgroundImage.src = './assets/images/gameOverScreen.png';
		this.backgroundLoaded = false;
		
		this.backgroundImage.onload = () => {
			this.backgroundLoaded = true;
		};
	}

	enter(parameters = {}) {
		this.finalScore = parameters.score || 0;
		this.initials = ["A", "A", "A"];
		this.currentIndex = 0;
		
		// Play game over sound when player loses
		if (sounds) {
			sounds.play('gameoverSound');
		}
	}

	update() {
		// Change letter
		if (input.isKeyPressed(Input.KEYS.ARROW_UP)) {
			this.changeLetter(1);
			// Play select sound when selecting/changing
			if (sounds) {
				sounds.play('selectSound');
			}
		}

		if (input.isKeyPressed(Input.KEYS.ARROW_DOWN)) {
			this.changeLetter(-1);
			// Play select sound when selecting/changing
			if (sounds) {
				sounds.play('selectSound');
			}
		}

		// Move cursor
		if (input.isKeyPressed(Input.KEYS.ARROW_LEFT)) {
			this.currentIndex = Math.max(0, this.currentIndex - 1);
			// Play select sound when selecting/changing
			if (sounds) {
				sounds.play('selectSound');
			}
		}

		if (input.isKeyPressed(Input.KEYS.ARROW_RIGHT)) {
			this.currentIndex = Math.min(MAX_INITIALS - 1, this.currentIndex + 1);
			// Play select sound when selecting/changing
			if (sounds) {
				sounds.play('selectSound');
			}
		}

		// Confirm
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			this.saveHighScore();
			stateMachine.change(GameStateName.HighScore);
		}
	}

	changeLetter(direction) {
		const code = this.initials[this.currentIndex].charCodeAt(0);
		let next = code + direction;

		if (next < 65) next = 90;
		if (next > 90) next = 65;

		this.initials[this.currentIndex] = String.fromCharCode(next);
	}

	saveHighScore() {
		const entry = {
			name: this.initials.join(""),
			score: this.finalScore,
		};

		const key = "star-defenders-highscores";
		const scores = JSON.parse(localStorage.getItem(key)) || [];

		scores.push(entry);

		// Sort descending and keep top 5
		scores.sort((a, b) => b.score - a.score);
		localStorage.setItem(key, JSON.stringify(scores.slice(0, 5)));
	}

	render() {
		// Background image
		if (this.backgroundLoaded && this.backgroundImage.complete) {
			context.drawImage(this.backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		} else {
			// Fallback black background while loading
			context.fillStyle = "black";
			context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		}

		// Score display
		context.fillStyle = "white";
		context.font = "bold 28px Orbitron"; // Game over screen uses Orbitron
		context.textAlign = "center";
		context.fillText(`SCORE: ${this.finalScore}`, CANVAS_WIDTH / 2, 200);

		// Instructions
		context.fillText("ENTER YOUR INITIALS", CANVAS_WIDTH / 2, 260);

		// Initials input
		context.font = "900 48px Orbitron"; // Large Orbitron for initials
		for (let i = 0; i < MAX_INITIALS; i++) {
			const x = CANVAS_WIDTH / 2 - 60 + i * 60;
			const y = 330;

			if (i === this.currentIndex) {
				context.strokeStyle = "#00FF00";
				context.lineWidth = 3;
				context.strokeRect(x - 25, y - 50, 50, 60);
			}

			context.fillStyle = "white";
			context.fillText(this.initials[i], x, y);
		}

		// Controls hint
		context.font = "bold 18px Orbitron";
		context.fillStyle = "#AAAAAA";
		context.fillText("UP/DOWN: Change  •  LEFT/RIGHT: Move  •  ENTER: Save", CANVAS_WIDTH / 2, 400);
	}
}
