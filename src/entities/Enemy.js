import GameEntity from "./GameEntity.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../globals.js";

export default class Enemy extends GameEntity {
	static WIDTH = 28;
	static HEIGHT = 28;

	constructor(x, y, type, points = 100) {
		super(x, y, Enemy.WIDTH, Enemy.HEIGHT);
		this.type = type;
		this.points = points;
		this.formationPosition = { x, y };
		this.state = 'entering';
		this.entryPath = [];
		this.entryPathIndex = 0;
		this.attackPath = [];
		this.attackPathIndex = 0;
		this.movementSpeed = 150;
		this.color = '#FF0000';
	}

	update(dt) {
		switch (this.state) {
			case 'entering':
				this.updateEntry(dt);
				break;
			case 'in-formation':
				this.updateFormation(dt);
				break;
			case 'attacking':
				this.updateAttack(dt);
				break;
		}

		if (this.isOffScreen() && this.state !== 'entering') {
			this.destroy();
		}
	}

	updateEntry(dt) {
		if (this.entryPath.length === 0 || this.entryPathIndex >= this.entryPath.length) {
			this.state = 'in-formation';
			this.position.x = this.formationPosition.x;
			this.position.y = this.formationPosition.y;
			this.velocity.x = 0;
			this.velocity.y = 0;
			return;
		}

		const target = this.entryPath[this.entryPathIndex];
		const dx = target.x - this.position.x;
		const dy = target.y - this.position.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < 5) {
			this.entryPathIndex++;
		} else {
			this.velocity.x = (dx / distance) * this.movementSpeed;
			this.velocity.y = (dy / distance) * this.movementSpeed;
			super.update(dt);
		}
	}

	updateFormation(dt) {
		// Enemies in formation can move slightly (handled by FormationController later)
		super.update(dt);
	}

	updateAttack(dt) {
		if (this.attackPath.length === 0 || this.attackPathIndex >= this.attackPath.length) {
			this.state = 'returning';
			this.returnToFormation();
			return;
		}

		const target = this.attackPath[this.attackPathIndex];
		const dx = target.x - this.position.x;
		const dy = target.y - this.position.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < 5) {
			this.attackPathIndex++;
		} else {
			this.velocity.x = (dx / distance) * this.movementSpeed * 1.5;
			this.velocity.y = (dy / distance) * this.movementSpeed * 1.5;
			super.update(dt);
		}
	}

	returnToFormation() {
		this.state = 'in-formation';
		this.velocity.x = 0;
		this.velocity.y = 0;
		this.attackPathIndex = 0;
	}

	setEntryPath(path) {
		this.entryPath = path;
		this.entryPathIndex = 0;
	}

	triggerAttack() {
		if (this.state !== 'in-formation') return;

		this.state = 'attacking';
		this.generateAttackPath();
	}

	generateAttackPath() {
		// Simple dive attack
		this.attackPath = [
			{ x: this.position.x, y: this.position.y + 200 },
			{ x: this.position.x - 100, y: this.position.y + 400 },
			{ x: this.position.x, y: CANVAS_HEIGHT + 50 }
		];
		this.attackPathIndex = 0;
	}

	render() {
		this.renderRectangle(this.color);
	}

	onCollision(other) {
		this.destroy();
	}

	getPoints() {
		return this.points;
	}
}