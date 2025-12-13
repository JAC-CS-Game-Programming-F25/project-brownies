import State from "../../lib/State.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, input, stateMachine } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class VictoryState extends State {
	constructor() {
		super();
	}

	update() {
		// Return to title screen
		if (
			input.isKeyPressed(Input.KEYS.ENTER) ||
			input.isKeyPressed(Input.KEYS.SPACE)
		) {
			stateMachine.change(GameStateName.TitleScreen);
		}
	}

	render() {
		// Background
		context.fillStyle = "black";
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Floating victory text
		const wave = Math.sin(performance.now() * 0.004) * 20;

		context.fillStyle = "#00FF00";
		context.font = "bold 64px Arial";
		context.textAlign = "center";
		context.fillText("YOU WIN!", CANVAS_WIDTH / 2, 220 + wave);

		// Subtitle
		context.font = "24px Arial";
		context.fillStyle = "white";
		context.fillText("All waves cleared!", CANVAS_WIDTH / 2, 300);

		// Blinking prompt
		if (Math.floor(performance.now() / 500) % 2 === 0) {
			context.fillStyle = "#AAAAAA";
			context.font = "18px Arial";
			context.fillText("Press ENTER or SPACE to return", CANVAS_WIDTH / 2, 350);
		}

		// Simple sparkle effect
		for (let i = 0; i < 20; i++) {
			const x = (i * 73 + performance.now() * 0.05) % CANVAS_WIDTH;
			const y = (i * 131 + performance.now() * 0.03) % CANVAS_HEIGHT;
			context.fillStyle = "#00FF00";
			context.fillRect(x, y, 2, 2);
		}
	}
}
