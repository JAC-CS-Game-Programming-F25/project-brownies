import State from "../../lib/State.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, input, stateMachine, sounds } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class VictoryState extends State {
	constructor() {
		super();
		this.backgroundImage = new Image();
		this.backgroundImage.src = './assets/images/youWinScreen.png';
		this.backgroundLoaded = false;
		
		this.backgroundImage.onload = () => {
			this.backgroundLoaded = true;
		};
	}

	enter() {
		// Play victory sound when completing everything
		if (sounds) {
			sounds.play('finallySound');
		}
	}

	update() {
		// Return to title screen - only ENTER
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
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

		// Mission Completed text - smaller and higher
		context.fillStyle = "#00FF00";
		context.font = "900 48px Orbitron";
		context.textAlign = "center";
		context.fillText("Mission Completed", CANVAS_WIDTH / 2, 120);

		// Message - higher with side margins
		context.font = "bold 20px Orbitron";
		context.fillStyle = "white";
		const margin = 60; // Side margins
		const maxWidth = CANVAS_WIDTH - (margin * 2);
		
		// Split long text if needed, but for now just center with margins
		const message1 = "Well done, Star Defender.";
		const message2 = "Peace has been restored across the universe.";
		
		context.fillText(message1, CANVAS_WIDTH / 2, 180);
		context.fillText(message2, CANVAS_WIDTH / 2, 220);

		// Blinking prompt - moved higher
		if (Math.floor(performance.now() / 500) % 2 === 0) {
			context.fillStyle = "#AAAAAA";
			context.font = "bold 18px Orbitron";
			context.fillText("Press ENTER to return", CANVAS_WIDTH / 2, 280);
		}
	}
}
