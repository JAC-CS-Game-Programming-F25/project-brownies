import SpriteSheet from './SpriteSheet.js';
import Animation from '../../lib/Animation.js';

/**
 * Manages all Galaga sprites with exact coordinate definitions
 */
export default class SpriteManager {
	constructor(context) {
		this.context = context;
		
		// Load all sprite sheets
		this.sheets = {
			ship: new SpriteSheet('./assets/images/sprite_ship.png', context),
			red: new SpriteSheet('./assets/images/sprite_red.png', context),
			blue: new SpriteSheet('./assets/images/sprite_blue.png', context),
			green: new SpriteSheet('./assets/images/sprite_green.png', context),
			purple: new SpriteSheet('./assets/images/sprite_purple.png', context),
			explosion: new SpriteSheet('./assets/images/sprite_explosion.png', context),
			enemyExplosion: new SpriteSheet('./assets/images/sprite_enemyExplosion.png', context),
			blueNEW: new SpriteSheet('./assets/images/sprite_blueNEW.png', context),
			redNEW: new SpriteSheet('./assets/images/sprite_redNEW.png', context),
			greyDown: new SpriteSheet('./assets/images/sprite_enemyGreyDown.png', context),
			purpleDown: new SpriteSheet('./assets/images/sprite_enemyPurpleDown.png', context),
			yellowDown: new SpriteSheet('./assets/images/sprite_enemyYellowDown.png', context),
			mainShip: new SpriteSheet('./assets/images/sprite_mainShip.png', context)
		};
		
		// Define all sprites with their coordinates
		this.sprites = {
			// MAIN PLAYER SHIP - uses sprite_mainShip.png (full image)
			mainShip: { sheet: 'mainShip', sprite: { x: 0, y: 0, width: 0, height: 0 } }, // Dimensions set dynamically
			
			// OLD PLAYER SHIP (7 frames) - 16x36 each, spacing of 18px (kept for compatibility)
			ship0: { sheet: 'ship', sprite: this.sheets.ship.getSprite(2, 0, 16, 36) },
			ship1: { sheet: 'ship', sprite: this.sheets.ship.getSprite(20, 0, 16, 36) },
			ship2: { sheet: 'ship', sprite: this.sheets.ship.getSprite(38, 0, 16, 36) },
			ship3: { sheet: 'ship', sprite: this.sheets.ship.getSprite(56, 0, 16, 36) },
			ship4: { sheet: 'ship', sprite: this.sheets.ship.getSprite(74, 0, 16, 36) },
			ship5: { sheet: 'ship', sprite: this.sheets.ship.getSprite(92, 0, 16, 36) },
			ship6: { sheet: 'ship', sprite: this.sheets.ship.getSprite(110, 0, 16, 36) },
			
			// RED ENEMY (7 frames) - 16x36 each
			red0: { sheet: 'red', sprite: this.sheets.red.getSprite(2, 0, 16, 36) },
			red1: { sheet: 'red', sprite: this.sheets.red.getSprite(20, 0, 16, 36) },
			red2: { sheet: 'red', sprite: this.sheets.red.getSprite(38, 0, 16, 36) },
			red3: { sheet: 'red', sprite: this.sheets.red.getSprite(56, 0, 16, 36) },
			red4: { sheet: 'red', sprite: this.sheets.red.getSprite(74, 0, 16, 36) },
			red5: { sheet: 'red', sprite: this.sheets.red.getSprite(92, 0, 16, 36) },
			red6: { sheet: 'red', sprite: this.sheets.red.getSprite(110, 0, 16, 36) },
			
			// BLUE ENEMY (8 frames) - 16x36 each
			blue0: { sheet: 'blue', sprite: this.sheets.blue.getSprite(2, 0, 16, 36) },
			blue1: { sheet: 'blue', sprite: this.sheets.blue.getSprite(20, 0, 16, 36) },
			blue2: { sheet: 'blue', sprite: this.sheets.blue.getSprite(38, 0, 16, 36) },
			blue3: { sheet: 'blue', sprite: this.sheets.blue.getSprite(56, 0, 16, 36) },
			blue4: { sheet: 'blue', sprite: this.sheets.blue.getSprite(74, 0, 16, 36) },
			blue5: { sheet: 'blue', sprite: this.sheets.blue.getSprite(92, 0, 16, 36) },
			blue6: { sheet: 'blue', sprite: this.sheets.blue.getSprite(110, 0, 16, 36) },
			blue7: { sheet: 'blue', sprite: this.sheets.blue.getSprite(128, 0, 16, 36) },
			
			// PURPLE ENEMY (7 frames) - 16x36 each
			purple0: { sheet: 'purple', sprite: this.sheets.purple.getSprite(2, 0, 16, 36) },
			purple1: { sheet: 'purple', sprite: this.sheets.purple.getSprite(20, 0, 16, 36) },
			purple2: { sheet: 'purple', sprite: this.sheets.purple.getSprite(38, 0, 16, 36) },
			purple3: { sheet: 'purple', sprite: this.sheets.purple.getSprite(56, 0, 16, 36) },
			purple4: { sheet: 'purple', sprite: this.sheets.purple.getSprite(74, 0, 16, 36) },
			purple5: { sheet: 'purple', sprite: this.sheets.purple.getSprite(92, 0, 16, 36) },
			purple6: { sheet: 'purple', sprite: this.sheets.purple.getSprite(110, 0, 16, 36) },
			
			// GREEN ENEMY (4 frames) - varying widths
			green0: { sheet: 'green', sprite: this.sheets.green.getSprite(2, 0, 17, 36) },
			green1: { sheet: 'green', sprite: this.sheets.green.getSprite(20, 0, 70, 36) },
			green2: { sheet: 'green', sprite: this.sheets.green.getSprite(92, 0, 40, 36) },
			green3: { sheet: 'green', sprite: this.sheets.green.getSprite(134, 0, 9, 36) },
			
			// EXPLOSION (4 frames) - 32x52 each
			explosion0: { sheet: 'explosion', sprite: this.sheets.explosion.getSprite(2, 0, 32, 52) },
			explosion1: { sheet: 'explosion', sprite: this.sheets.explosion.getSprite(36, 0, 32, 52) },
			explosion2: { sheet: 'explosion', sprite: this.sheets.explosion.getSprite(70, 0, 32, 52) },
			explosion3: { sheet: 'explosion', sprite: this.sheets.explosion.getSprite(104, 0, 32, 52) },
			
			// ENEMY EXPLOSION (4 frames) - 32x52 each
			enemyExplosion0: { sheet: 'enemyExplosion', sprite: this.sheets.enemyExplosion.getSprite(2, 0, 32, 52) },
			enemyExplosion1: { sheet: 'enemyExplosion', sprite: this.sheets.enemyExplosion.getSprite(36, 0, 32, 52) },
			enemyExplosion2: { sheet: 'enemyExplosion', sprite: this.sheets.enemyExplosion.getSprite(70, 0, 32, 52) },
			enemyExplosion3: { sheet: 'enemyExplosion', sprite: this.sheets.enemyExplosion.getSprite(104, 0, 32, 52) },
			
			// BLUE NEW ENEMY - 46×48 sheet with 2 frames (full 48px height)
			blueNEW0: { sheet: 'blueNEW', sprite: this.sheets.blueNEW.getSprite(8, 0, 13, 48) },
			blueNEW1: { sheet: 'blueNEW', sprite: this.sheets.blueNEW.getSprite(29, 0, 9, 48) },
			
			// RED NEW ENEMY - 46×48 sheet with 2 frames (full 48px height)
			redNEW0: { sheet: 'redNEW', sprite: this.sheets.redNEW.getSprite(8, 0, 13, 48) },
			redNEW1: { sheet: 'redNEW', sprite: this.sheets.redNEW.getSprite(29, 0, 9, 48) },
			
			// GREY DOWN ENEMY - 8 frames (16×36 each)
			greyDown0: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(2, 0, 16, 36) },
			greyDown1: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(20, 0, 16, 36) },
			greyDown2: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(37, 0, 16, 36) },
			greyDown3: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(54, 0, 16, 36) },
			greyDown4: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(70, 0, 16, 36) },
			greyDown5: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(86, 0, 16, 36) },
			greyDown6: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(102, 0, 16, 36) },
			greyDown7: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(119, 0, 16, 36) },
			
			// PURPLE DOWN ENEMY - 8 frames (16×36 each)
			purpleDown0: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(2, 0, 16, 36) },
			purpleDown1: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(20, 0, 16, 36) },
			purpleDown2: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(37, 0, 16, 36) },
			purpleDown3: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(54, 0, 16, 36) },
			purpleDown4: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(70, 0, 16, 36) },
			purpleDown5: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(86, 0, 16, 36) },
			purpleDown6: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(102, 0, 16, 36) },
			purpleDown7: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(119, 0, 16, 36) },
			
			// YELLOW DOWN ENEMY - 8 frames (16×36 each)
			yellowDown0: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(2, 0, 16, 36) },
			yellowDown1: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(20, 0, 16, 36) },
			yellowDown2: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(37, 0, 16, 36) },
			yellowDown3: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(54, 0, 16, 36) },
			yellowDown4: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(70, 0, 16, 36) },
			yellowDown5: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(86, 0, 16, 36) },
			yellowDown6: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(102, 0, 16, 36) },
			yellowDown7: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(119, 0, 16, 36) },
		};
		
		// Animation sequences
		this.animations = {
			playerShip: ['ship0', 'ship1', 'ship2', 'ship3', 'ship4', 'ship5', 'ship6'],
			enemyRed: ['red0', 'red1', 'red2', 'red3', 'red4', 'red5', 'red6'],
			enemyBlue: ['blue0', 'blue1', 'blue2', 'blue3', 'blue4', 'blue5', 'blue6', 'blue7'],
			enemyPurple: ['purple0', 'purple1', 'purple2', 'purple3', 'purple4', 'purple5', 'purple6'],
			enemyGreen: ['green0', 'green1', 'green2', 'green3'],
			explode: ['explosion0', 'explosion1', 'explosion2', 'explosion3'],
			enemyExplode: ['enemyExplosion0', 'enemyExplosion1', 'enemyExplosion2', 'enemyExplosion3'],
			// Blue Bumble animation - only uses blueNEW sprite sheet (loops frames 0-1)
			enemyBlueBumble: ['blueNEW0', 'blueNEW1'],
			// Red Bumble animation - only uses redNEW sprite sheet (loops frames 0-1)
			enemyRedBumble: ['redNEW0', 'redNEW1'],
			
			// Down enemy animations - entry frames (0-5) and idle frames (6-7)
			enemyGreyDownEntry: ['greyDown0', 'greyDown1', 'greyDown2', 'greyDown3', 'greyDown4', 'greyDown5'],
			enemyGreyDownIdle: ['greyDown6', 'greyDown7'],
			enemyPurpleDownEntry: ['purpleDown0', 'purpleDown1', 'purpleDown2', 'purpleDown3', 'purpleDown4', 'purpleDown5'],
			enemyPurpleDownIdle: ['purpleDown6', 'purpleDown7'],
			enemyYellowDownEntry: ['yellowDown0', 'yellowDown1', 'yellowDown2', 'yellowDown3', 'yellowDown4', 'yellowDown5'],
			enemyYellowDownIdle: ['yellowDown6', 'yellowDown7']
		};
		
		// Create Animation objects for each animation sequence
		this.animationObjects = {};
		this.initializeAnimations();
	}
	
	initializeAnimations() {
		// Player ship animation (7 frames, 0.15s per frame)
		this.animationObjects.playerShip = new Animation(
			[0, 1, 2, 3, 4, 5, 6],
			0.15
		);
		
		// Red enemy animation (7 frames, 0.15s per frame)
		this.animationObjects.enemyRed = new Animation(
			[0, 1, 2, 3, 4, 5, 6],
			0.15
		);
		
		// Blue enemy animation (8 frames, 0.15s per frame)
		this.animationObjects.enemyBlue = new Animation(
			[0, 1, 2, 3, 4, 5, 6, 7],
			0.15
		);
		
		// Blue Bumble animation (2 frames looping, 0.2s per frame)
		this.animationObjects.enemyBlueBumble = new Animation(
			[0, 1],
			0.2
		);
		
		// Red Bumble animation (2 frames looping, 0.2s per frame)
		this.animationObjects.enemyRedBumble = new Animation(
			[0, 1],
			0.2
		);
		
		// Grey Down enemy animations
		// Entry animation: frames 0-5 (play once)
		this.animationObjects.enemyGreyDownEntry = new Animation(
			[0, 1, 2, 3, 4, 5],
			0.15,
			1 // Play once
		);
		// Idle animation: frames 6-7 (loop continuously)
		this.animationObjects.enemyGreyDownIdle = new Animation(
			[0, 1], // Frames 6-7 mapped as 0-1 in the idle array
			0.15
		);
		
		// Purple Down enemy animations
		this.animationObjects.enemyPurpleDownEntry = new Animation(
			[0, 1, 2, 3, 4, 5],
			0.15,
			1 // Play once
		);
		this.animationObjects.enemyPurpleDownIdle = new Animation(
			[0, 1],
			0.15
		);
		
		// Yellow Down enemy animations
		this.animationObjects.enemyYellowDownEntry = new Animation(
			[0, 1, 2, 3, 4, 5],
			0.15,
			1 // Play once
		);
		this.animationObjects.enemyYellowDownIdle = new Animation(
			[0, 1],
			0.15
		);
		
		// Purple enemy animation (7 frames, 0.2s per frame)
		this.animationObjects.enemyPurple = new Animation(
			[0, 1, 2, 3, 4, 5, 6],
			0.2
		);
		
		// Green enemy animation (4 frames, 0.2s per frame)
		this.animationObjects.enemyGreen = new Animation(
			[0, 1, 2, 3],
			0.2
		);
		
		// Explosion animation (4 frames, 0.1s per frame, play once)
		this.animationObjects.explode = new Animation(
			[0, 1, 2, 3],
			0.1,
			1
		);
		
		// Enemy explosion animation (4 frames, 0.1s per frame, play once)
		this.animationObjects.enemyExplode = new Animation(
			[0, 1, 2, 3],
			0.1,
			1
		);
		
		// Map to old animation names for compatibility
		this.animationObjects.enemyRedFly = this.animationObjects.enemyRed;
		this.animationObjects.enemyBlueFly = this.animationObjects.enemyBlue;
		this.animationObjects.enemyYellowFly = this.animationObjects.enemyPurple;
		this.animationObjects.bossFly = this.animationObjects.enemyRed;
		
		
		// Map down enemy animations (for compatibility with existing code)
		this.animationObjects.enemyGreyDown = this.animationObjects.enemyGreyDownEntry;
		this.animationObjects.enemyPurpleDown = this.animationObjects.enemyPurpleDownEntry;
		this.animationObjects.enemyYellowDown = this.animationObjects.enemyYellowDownEntry;
		
		// Map animation names to their frame arrays
		this.animationNameMap = {
			playerShip: 'playerShip',
			enemyRed: 'enemyRed',
			enemyRedFly: 'enemyRed',
			enemyBlue: 'enemyBlue',
			enemyBlueFly: 'enemyBlue',
			enemyPurple: 'enemyPurple',
			enemyYellowFly: 'enemyPurple',
			enemyGreen: 'enemyGreen',
			bossFly: 'enemyRed',
			explode: 'explode',
			enemyExplode: 'enemyExplode',
			enemyBlueBumble: 'enemyBlueBumble',
			enemyRedBumble: 'enemyRedBumble',
			enemyGreyDownEntry: 'enemyGreyDownEntry',
			enemyGreyDownIdle: 'enemyGreyDownIdle',
			enemyGreyDown: 'enemyGreyDownEntry',
			enemyPurpleDownEntry: 'enemyPurpleDownEntry',
			enemyPurpleDownIdle: 'enemyPurpleDownIdle',
			enemyPurpleDown: 'enemyPurpleDownEntry',
			enemyYellowDownEntry: 'enemyYellowDownEntry',
			enemyYellowDownIdle: 'enemyYellowDownIdle',
			enemyYellowDown: 'enemyYellowDownEntry'
		};
	}
	
	draw(spriteName, x, y, scale = 1) {
		const spriteData = this.sprites[spriteName];
		if (!spriteData) {
			return false;
		}
		
		const sheet = this.sheets[spriteData.sheet];
		if (!sheet || !sheet.isReady()) {
			return false;
		}
		
		// For mainShip, use the full image dimensions dynamically
		let sprite = spriteData.sprite;
		if (spriteName === 'mainShip') {
			// Use full image dimensions - update if not set or if image loaded
			if (sheet.image.naturalWidth > 0 && (sprite.width === 0 || sprite.height === 0)) {
				sprite = sheet.getSprite(0, 0, sheet.image.naturalWidth, sheet.image.naturalHeight);
				// Update the stored sprite for next time
				spriteData.sprite = sprite;
			} else if (sprite.width === 0 || sprite.height === 0) {
				// Image not ready yet
				return false;
			}
		} else if (!sprite || sprite.width === 0) {
			return false;
		}
		
		return sheet.draw(sprite, x, y, scale);
	}
	
	getAnimation(animName) {
		return this.animations[animName] || [];
	}
	
	getAnimationObject(animName) {
		return this.animationObjects[animName];
	}
	
	getAnimationSprite(animName) {
		const anim = this.animationObjects[animName];
		if (!anim) {
			return null;
		}
		
		const frameIndex = anim.getCurrentFrame();
		// Map the animation name to the correct frame array name
		const frameArrayName = this.animationNameMap[animName] || animName;
		const frameNames = this.animations[frameArrayName];
		
		if (!frameNames || frameIndex >= frameNames.length) {
			return null;
		}
		
		return frameNames[frameIndex];
	}
	
	drawAnimation(animName, x, y, scale = 1) {
		const spriteName = this.getAnimationSprite(animName);
		if (!spriteName) return false;
		
		return this.draw(spriteName, x, y, scale);
	}
	
	update(dt) {
		Object.values(this.animationObjects).forEach(anim => {
			if (anim) anim.update(dt);
		});
	}
	
	isLoaded() {
		return Object.values(this.sheets).every(sheet => sheet.isReady());
	}
}
