import State from "../../lib/State.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, input, stateMachine, sounds } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class WaveCompleteState extends State {
	constructor() {
		super();
		this.backgroundImage = new Image();
		this.backgroundImage.src = './assets/images/waveClearedScreen.png';
		this.backgroundLoaded = false;
		
		this.backgroundImage.onload = () => {
			this.backgroundLoaded = true;
		};
	}


	enter(parameters = {}) {
		this.wave = parameters.wave ?? 1;
		this.score = parameters.score ?? 0;
		this.gunLevel = parameters.gunLevel ?? 1;
		this.gunUpgradeShown = parameters.gunUpgradeShown ?? false;
		
		// Play wave completed sound
		if (sounds) {
			sounds.play('waveCompletedSound');
		}
	}

	update() {
		// Continue to next wave - only ENTER
		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			stateMachine.change(GameStateName.Play, {
				wave: this.wave + 1,
				score: this.score,
				gunLevel: this.gunLevel,
				gunUpgradeShown: this.gunUpgradeShown,
				previousScore: this.score
			});
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

		// Info
		context.fillStyle = "white";
		context.font = "bold 28px Orbitron";
		context.textAlign = "center";
		context.fillText(`Wave ${this.wave} Complete`, CANVAS_WIDTH / 2, 270);
		context.fillText(`Score: ${this.score}`, CANVAS_WIDTH / 2, 310);

		// Prompt (blinking)
		if (Math.floor(performance.now() / 500) % 2 === 0) {
			context.fillStyle = "#AAAAAA";
			context.font = "bold 20px Orbitron";
			context.fillText("Press ENTER to Continue", CANVAS_WIDTH / 2, 400);
		}
	}
}
