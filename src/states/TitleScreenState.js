import State from "../../lib/State.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, input, stateMachine } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class TitleScreenState extends State {
	constructor() {
		super();
	}

	enter() {
		this.selectedOption = 0;
		this.options = ['Start Game', 'High Score', 'Quit'];
	}

	update(dt) {
		if (input.isKeyPressed(Input.KEYS.ARROW_UP) || input.isKeyPressed(Input.KEYS.W)) {
			this.selectedOption = Math.max(0, this.selectedOption - 1);
		}

		if (input.isKeyPressed(Input.KEYS.ARROW_DOWN) || input.isKeyPressed(Input.KEYS.S)) {
			this.selectedOption = Math.min(this.options.length - 1, this.selectedOption + 1);
		}

		if (input.isKeyPressed(Input.KEYS.ENTER) || input.isKeyPressed(Input.KEYS.SPACE)) {
			this.selectOption();
		}
	}

	selectOption() {
		switch (this.selectedOption) {
			case 0: // Start Game
				stateMachine.change(GameStateName.Play);
				break;
			case 1: // High Score
				// TODO: Show high score
				break;
			case 2: // Quit
				window.close();
				break;
		}
	}

	render() {
		// Background
		context.save();
		context.fillStyle = '#000033';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.restore();

		// Title
		context.save();
		context.fillStyle = 'white';
		context.font = 'bold 48px Arial';
		context.textAlign = 'center';
		context.fillText('STAR DEFENDERS', CANVAS_WIDTH / 2, 150);
		context.restore();

		// Menu options
		context.save();
		context.font = '24px Arial';
		context.textAlign = 'center';

		this.options.forEach((option, index) => {
			const y = 250 + index * 60;
			
			if (index === this.selectedOption) {
				// Draw selection box
				context.strokeStyle = 'white';
				context.lineWidth = 3;
				context.strokeRect(CANVAS_WIDTH / 2 - 120, y - 30, 240, 50);
			}

			context.fillStyle = index === this.selectedOption ? '#00FF00' : 'white';
			context.fillText(option, CANVAS_WIDTH / 2, y);
		});
		context.restore();
	}
}