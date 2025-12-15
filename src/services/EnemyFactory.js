import EnemyType from "../enums/EnemyType.js";
import GreyAlienEnemy from "../entities/GreyAlienEnemy.js";
import PurpleAlienEnemy from "../entities/PurpleAlienEnemy.js";
import YellowAlienEnemy from "../entities/YellowAlienEnemy.js";
import BlueBumbleEnemy from "../entities/BlueBumbleEnemy.js";
import RedBumbleEnemy from "../entities/RedBumbleEnemy.js";
import { CANVAS_WIDTH } from "../globals.js";

/**
 * EnemyFactory - Factory class for creating enemies and waves
 * 
 * This class uses the Factory pattern to create enemy instances and manage
 * wave generation. It centralizes all enemy creation logic, making it easy
 * to modify enemy compositions and formations across waves.
 * 
 * Key responsibilities:
 * - Creating individual enemy instances based on type
 * - Generating wave formations (different layouts for each wave)
 * - Setting up enemy entry paths (how enemies appear on screen)
 * 
 * Wave Design:
 * - Wave 1: Standard grid formation, mixed enemy types, no shooting
 * - Wave 2: Different formation layout, enemies can shoot while attacking
 * - Wave 3+: V-shaped formation, enemies shoot more frequently and track player more aggressively
 */
export default class EnemyFactory {
	/**
	 * Creates a single enemy instance of the specified type
	 * 
	 * This method uses the Factory pattern to instantiate the correct
	 * enemy subclass based on the type enum. Each enemy type has its
	 * own class with specific animations and point values.
	 * 
	 * @param {EnemyType} type - The type of enemy to create
	 * @param {number} x - Initial X position
	 * @param {number} y - Initial Y position
	 * @returns {Enemy} The created enemy instance
	 */
	static createEnemy(type, x, y) {
		switch (type) {
			case EnemyType.GreyAlien:
				return new GreyAlienEnemy(x, y);
			case EnemyType.PurpleAlien:
				return new PurpleAlienEnemy(x, y);
			case EnemyType.YellowAlien:
				return new YellowAlienEnemy(x, y);
			case EnemyType.BlueBumble:
				return new BlueBumbleEnemy(x, y);
			case EnemyType.RedBumble:
				return new RedBumbleEnemy(x, y);
			default:
				// Default to GreyAlien if unknown type (shouldn't happen, but safe fallback)
				return new GreyAlienEnemy(x, y);
		}
	}

	/**
	 * Creates a complete wave of enemies with formation and entry paths
	 * 
	 * This is the main method for wave generation. It:
	 * 1. Creates enemies in the appropriate formation layout for the wave
	 * 2. Generates entry paths for each enemy (how they appear on screen)
	 * 3. Positions enemies at the start of their entry paths
	 * 
	 * Wave progression:
	 * - Wave 1: Standard grid (5 rows × 6 columns)
	 * - Wave 2: Modified grid with different spacing
	 * - Wave 3+: V-shaped formation for more challenging gameplay
	 * 
	 * @param {number} waveNumber - The wave number (1, 2, 3+)
	 * @returns {Enemy[]} Array of enemy instances ready to enter the screen
	 */
	static createWave(waveNumber) {
		let enemies = [];
		
		// Choose formation based on wave number
		if (waveNumber === 1) {
			enemies = this.createWave1Formation();
		} else if (waveNumber === 2) {
			enemies = this.createWave2Formation();
		} else if (waveNumber >= 3) {
			enemies = this.createWave3Formation();
		}

		// Set up entry paths for all enemies so they fly in from off-screen
		// Each enemy gets a unique entry path that positions them at their formation spot
		enemies.forEach((enemy, index) => {
			const entryPath = this.generateEntryPath(enemy, index);
			enemy.setEntryPath(entryPath);
			// Position enemy at the start of their entry path (off-screen)
			if (entryPath.length > 0) {
				enemy.position.x = entryPath[0].x;
				enemy.position.y = entryPath[0].y;
			}
		});

		return enemies;
	}
	
	static createWave1Formation() {
		// Wave 1: Standard grid formation with mixed enemy types
		const enemies = [];
		const cols = 10;
		const rows = 4;
		const spacing = 50;
		const startX = (CANVAS_WIDTH - (cols * spacing)) / 2;
		const startY = 80;
		
		const enemyTypes = [
			EnemyType.RedBumble,    // Row 0
			EnemyType.PurpleAlien,  // Row 1
			EnemyType.BlueBumble,   // Row 2
			EnemyType.YellowAlien   // Row 3
		];

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const x = startX + col * spacing;
				const y = startY + row * spacing;
				// Mix enemy types: alternate every other column
				const typeIndex = col % 2 === 0 ? row : (row + 2) % enemyTypes.length;
				const enemy = this.createEnemy(enemyTypes[typeIndex], x, y);
				enemy.formationPosition = { x, y };
				enemies.push(enemy);
			}
		}

		return enemies;
	}
	
	static createWave2Formation() {
		// Wave 2: Different positioning - shuffled arrangement
		const enemies = [];
		const cols = 10;
		const rows = 4;
		const spacing = 50;
		const startX = (CANVAS_WIDTH - (cols * spacing)) / 2;
		const startY = 80;
		
		// Shuffled pattern: different arrangement than Wave 1
		const pattern = [
			[EnemyType.YellowAlien, EnemyType.RedBumble, EnemyType.BlueBumble, EnemyType.PurpleAlien, EnemyType.GreyAlien],
			[EnemyType.PurpleAlien, EnemyType.BlueBumble, EnemyType.RedBumble, EnemyType.YellowAlien, EnemyType.GreyAlien],
			[EnemyType.GreyAlien, EnemyType.PurpleAlien, EnemyType.YellowAlien, EnemyType.BlueBumble, EnemyType.RedBumble],
			[EnemyType.BlueBumble, EnemyType.GreyAlien, EnemyType.RedBumble, EnemyType.YellowAlien, EnemyType.PurpleAlien]
		];

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const x = startX + col * spacing;
				const y = startY + row * spacing;
				const typeIndex = col % 5;
				const enemy = this.createEnemy(pattern[row][typeIndex], x, y);
				enemy.formationPosition = { x, y };
				enemies.push(enemy);
			}
		}

		return enemies;
	}
	
	static createWave3Formation() {
		// Wave 3: V-shape formation (different formation shape)
		const enemies = [];
		const spacing = 50;
		const startX = CANVAS_WIDTH / 2;
		const startY = 80;
		
		const enemyTypes = [
			EnemyType.RedBumble,
			EnemyType.PurpleAlien,
			EnemyType.BlueBumble,
			EnemyType.YellowAlien,
			EnemyType.GreyAlien
		];
		
		// Create V-shape: starts narrow at top, widens toward bottom
		const rows = 4;
		for (let row = 0; row < rows; row++) {
			const colsInRow = 3 + row * 2; // 3, 5, 7, 9 enemies per row
			const rowStartX = startX - ((colsInRow - 1) * spacing) / 2;
			
			for (let col = 0; col < colsInRow; col++) {
				const x = rowStartX + col * spacing;
				const y = startY + row * spacing;
				const typeIndex = (row + col) % enemyTypes.length;
				const enemy = this.createEnemy(enemyTypes[typeIndex], x, y);
				enemy.formationPosition = { x, y };
				enemies.push(enemy);
			}
		}

		return enemies;
	}

	static generateEntryPath(enemy, index) {
		const side = index % 2 === 0 ? 'left' : 'right';
		const startX = side === 'left' ? -50 : CANVAS_WIDTH + 50;
		const startY = -50;

		return [
			{ x: startX, y: startY },
			{ x: startX, y: 100 },
			{ x: enemy.formationPosition.x, y: 100 },
			{ x: enemy.formationPosition.x, y: enemy.formationPosition.y }
		];
	}
}