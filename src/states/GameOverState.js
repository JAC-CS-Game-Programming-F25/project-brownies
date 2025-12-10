import State from "../../lib/State.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, context, input, stateMachine } from "../globals.js";
import Input from "../../lib/Input.js";
import GameStateName from "../enums/GameStateName.js";

export default class GameOverState extends State {
	constructor() {
		super();
	}

	enter(parameters = {}) {
		this.finalScore = parameters.score || 0;
	}

	update(dt) {
		if (input.isKeyPressed(Input.KEYS.ENTER) || input.isKeyPressed(Input.KEYS.SPACE)) {
			stateMachine.change(GameStateName.TitleScreen);
		}
	}

	render() {
		// Background
		context.save();
		context.fillStyle = '#000033';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.restore();

		// Game Over text
		context.save();
		context.fillStyle = 'red';
		context.font = 'bold 64px Arial';
		context.textAlign = 'center';
		context.fillText('GAME OVER', CANVAS_WIDTH / 2, 200);
		context.restore();

		// Final Score
		context.save();
		context.fillStyle = 'white';
		context.font = '32px Arial';
		context.textAlign = 'center';
		context.fillText(`FINAL SCORE`, CANVAS_WIDTH / 2, 280);
		context.fillText(`${this.finalScore}`, CANVAS_WIDTH / 2, 330);
		context.restore();

		// Return prompt
		context.save();
		context.strokeStyle = 'white';
		context.lineWidth = 3;
		context.strokeRect(CANVAS_WIDTH / 2 - 150, 380, 300, 60);
		context.fillStyle = 'white';
		context.font = '24px Arial';
		context.textAlign = 'center';
		context.fillText('Return to Menu', CANVAS_WIDTH / 2, 420);
		context.restore();

		// Prompt
		context.save();
		context.fillStyle = '#888';
		context.font = '16px Arial';
		context.textAlign = 'center';
		context.fillText('Press ENTER or SPACE', CANVAS_WIDTH / 2, 460);
		context.restore();
	}}
	