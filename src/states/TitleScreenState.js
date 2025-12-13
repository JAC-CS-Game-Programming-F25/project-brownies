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
		this.options = ['Start Game', 'High Score'];
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
			stateMachine.change(GameStateName.Play, { score: 0, wave: 1 });
			break;

		case 1: // High Score
			stateMachine.change(GameStateName.HighScore);
			break;
	}
}


	render() {
	// Background
	context.fillStyle = "black";
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	// Animated stars
	context.fillStyle = "white";
	for (let i = 0; i < 60; i++) {
		const x = (i * 97) % CANVAS_WIDTH;
		const y = (i * 53 + performance.now() * 0.03) % CANVAS_HEIGHT;
		context.fillRect(x, y, 2, 2);
	}

	// Pulsing title
	const pulse = Math.sin(performance.now() * 0.003) * 10;
	context.fillStyle = "#00FFFF";
	context.font = `bold ${64 + pulse}px Arial`;
	context.textAlign = "center";
	context.fillText("STAR DEFENDERS", CANVAS_WIDTH / 2, 160);

	// Menu
	context.font = "28px Arial";
	this.options.forEach((option, index) => {
		const y = 280 + index * 60;

		if (index === this.selectedOption) {
			context.strokeStyle = "#00FF00";
			context.lineWidth = 4;
			context.strokeRect(CANVAS_WIDTH / 2 - 160, y - 36, 320, 50);
		}

		context.fillStyle = index === this.selectedOption ? "#00FF00" : "white";
		context.fillText(option, CANVAS_WIDTH / 2, y);
	});
}

}