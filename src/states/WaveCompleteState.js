import State from "../../lib/State.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, input, stateMachine } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class WaveCompleteState extends State {
	enter(parameters = {}) {
		this.wave = parameters.wave ?? 1;
		this.score = parameters.score ?? 0;
	}

	update() {
		// Continue to next wave
		if (
			input.isKeyPressed(Input.KEYS.ENTER) ||
			input.isKeyPressed(Input.KEYS.SPACE)
		) {
			stateMachine.change(GameStateName.Play, {
				wave: this.wave + 1,
				score: this.score
			});
		}
	}

	render() {
		// Background
		context.fillStyle = "black";
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Title
		context.fillStyle = "#00FF00";
		context.font = "bold 56px Arial";
		context.textAlign = "center";
		context.fillText("WAVE CLEARED!", CANVAS_WIDTH / 2, 200);

		// Info
		context.fillStyle = "white";
		context.font = "28px Arial";
		context.fillText(`Wave ${this.wave} Complete`, CANVAS_WIDTH / 2, 270);
		context.fillText(`Score: ${this.score}`, CANVAS_WIDTH / 2, 310);

		// Prompt (blinking)
		if (Math.floor(performance.now() / 500) % 2 === 0) {
			context.fillStyle = "#AAAAAA";
			context.font = "20px Arial";
			context.fillText("Press ENTER to Continue", CANVAS_WIDTH / 2, 380);
		}
	}
}
