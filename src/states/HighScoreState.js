import State from "../../lib/State.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, input, stateMachine } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class HighScoreState extends State {
	enter() {
		const key = "star-defenders-highscores";
		this.scores = JSON.parse(localStorage.getItem(key)) || [];

		// Ensure exactly 5 entries
		while (this.scores.length < 5) {
			this.scores.push({ name: "---", score: 0 });
		}
	}

	update() {
		if (input.isKeyPressed(Input.KEYS.ENTER) || input.isKeyPressed(Input.KEYS.ESCAPE)) {
			stateMachine.change(GameStateName.TitleScreen);
		}
	}

	render() {
		context.fillStyle = "black";
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		context.fillStyle = "#FFD700";
		context.font = "bold 56px Arial";
		context.textAlign = "center";
		context.fillText("HIGH SCORES", CANVAS_WIDTH / 2, 120);

		context.font = "28px Arial";
		this.scores.forEach((entry, index) => {
			const y = 200 + index * 50;
			const text = `${index + 1}. ${entry.name}  —  ${entry.score}`;
			context.fillStyle = entry.name === "---" ? "#666" : "white";
			context.fillText(text, CANVAS_WIDTH / 2, y);
		});

		context.font = "18px Arial";
		context.fillStyle = "#AAAAAA";
		context.fillText("Press ENTER to return", CANVAS_WIDTH / 2, 460);
	}
}
