import State from "../../lib/State.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, input, stateMachine, sounds } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class TitleScreenState extends State {
	constructor() {
		super();
		this.backgroundImage = new Image();
		this.backgroundImage.src = './assets/images/mainScreen.png';
		this.backgroundLoaded = false;
		
		this.backgroundImage.onload = () => {
			this.backgroundLoaded = true;
		};
	}

	enter() {
		this.selectedOption = 0;
		this.options = ['Start Game', 'High Score'];
		// Play main menu sound
		if (sounds) {
			sounds.play('mainMenuSound');
		}
	}

	update(dt) {
		if (input.isKeyPressed(Input.KEYS.ARROW_UP) || input.isKeyPressed(Input.KEYS.W)) {
			this.selectedOption = Math.max(0, this.selectedOption - 1);
			// Play select sound when selecting options
			if (sounds) {
				sounds.play('selectSound');
			}
		}

		if (input.isKeyPressed(Input.KEYS.ARROW_DOWN) || input.isKeyPressed(Input.KEYS.S)) {
			this.selectedOption = Math.min(this.options.length - 1, this.selectedOption + 1);
			// Play select sound when selecting options
			if (sounds) {
				sounds.play('selectSound');
			}
		}

		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			this.selectOption();
		}
	}

	selectOption() {
		// Stop main menu sound when leaving
		if (sounds) {
			sounds.stop('mainMenuSound');
		}
		
		switch (this.selectedOption) {
			case 0: // Start Game
				stateMachine.change(GameStateName.Play, { score: 0, wave: 1 });
				break;

			case 1: // High Score
				stateMachine.change(GameStateName.HighScore);
				break;
		}
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

		// Menu options with selection indicator
		context.font = "bold 28px Orbitron"; // Title screen uses Orbitron
		context.textAlign = "center";
		
		this.options.forEach((option, index) => {
			const y = 320 + index * 60; // Moved down from 280 to 320

			// Selection highlight
			if (index === this.selectedOption) {
				// Draw selection box with semi-transparent background
				context.fillStyle = "rgba(255, 255, 255, 0.2)";
				context.fillRect(CANVAS_WIDTH / 2 - 160, y - 36, 320, 50);
				
				// Selection border
				context.strokeStyle = "#FFFFFF";
				context.lineWidth = 4;
				context.strokeRect(CANVAS_WIDTH / 2 - 160, y - 36, 320, 50);
			}

			// Menu text - selected is white, unselected is a dimmer color
			context.fillStyle = index === this.selectedOption ? "#FFFFFF" : "#AAAAAA";
			context.fillText(option, CANVAS_WIDTH / 2, y);
		});
	}

}