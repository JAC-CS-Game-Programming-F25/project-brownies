import State from "../../lib/State.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, input, stateMachine, sounds } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class HighScoreState extends State {
	constructor() {
		super();
		this.backgroundImage = new Image();
		this.backgroundImage.src = './assets/images/highScoresScreen.png';
		this.backgroundLoaded = false;
		
		this.backgroundImage.onload = () => {
			this.backgroundLoaded = true;
		};
	}

	enter() {
		const key = "star-defenders-highscores";
		this.scores = JSON.parse(localStorage.getItem(key)) || [];

		// Ensure exactly 5 entries
		while (this.scores.length < 5) {
			this.scores.push({ name: "---", score: 0 });
		}
		
		// Play main menu sound (score board is shown on main screen)
		if (sounds) {
			sounds.play('mainMenuSound');
		}
	}

	update() {
		if (input.isKeyPressed(Input.KEYS.ENTER) || input.isKeyPressed(Input.KEYS.ESCAPE)) {
			// Stop main menu sound when leaving
			if (sounds) {
				sounds.stop('mainMenuSound');
			}
			stateMachine.change(GameStateName.TitleScreen);
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

		// Score list
		context.font = "bold 28px Orbitron";
		context.textAlign = "center";
		this.scores.forEach((entry, index) => {
			const y = 200 + index * 50;
			const text = `${index + 1}. ${entry.name}  —  ${entry.score}`;
			context.fillStyle = entry.name === "---" ? "#666" : "white";
			context.fillText(text, CANVAS_WIDTH / 2, y);
		});

		// Return prompt
		context.font = "bold 18px Orbitron";
		context.fillStyle = "#AAAAAA";
		context.fillText("Press ENTER to return", CANVAS_WIDTH / 2, 460);
	}
}
