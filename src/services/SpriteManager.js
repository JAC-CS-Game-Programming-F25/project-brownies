import SpriteSheet from './SpriteSheet.js';
import Animation from '../../lib/Animation.js';

/**
 * SpriteManager - Centralized sprite and animation management system
 * 
 * This class handles all sprite sheet loading, sprite definitions, and animation sequences
 * for the game. It provides a clean interface for entities to draw sprites and animations
 * without needing to know the internal implementation details.
 * 
 * Key responsibilities:
 * - Loading sprite sheets from image files
 * - Defining individual sprite coordinates within sprite sheets
 * - Creating animation sequences from sprite frames
 * - Providing methods to draw sprites and animations at specific positions
 * - Managing animation timing and frame updates
 */
export default class SpriteManager {
	constructor(context) {
		this.context = context;
		
		// Load all sprite sheets used in the game
		// Each sheet contains multiple frames that we extract using coordinates
		this.sheets = {
			// Player ship sprite (single frame, full image)
			mainShip: new SpriteSheet('./assets/images/sprite_mainShip.png', context),
			
			// Enemy explosion sprite sheet (7 frames, 192x192 each)
			enemyExplosion: new SpriteSheet('./assets/images/sprite_enemyExplosion.png', context),
			
			// Blue and Red Bumble enemy sprite sheets (2 frames each, looping animations)
			blueNEW: new SpriteSheet('./assets/images/sprite_blueNEW.png', context),
			redNEW: new SpriteSheet('./assets/images/sprite_redNEW.png', context),
			
			// Down-facing alien enemy sprite sheets (8 frames each: 6 entry + 2 idle)
			greyDown: new SpriteSheet('./assets/images/sprite_enemyGreyDown.png', context),
			purpleDown: new SpriteSheet('./assets/images/sprite_enemyPurpleDown.png', context),
			yellowDown: new SpriteSheet('./assets/images/sprite_enemyYellowDown.png', context)
		};
		
		// Define all individual sprites with their exact coordinates within sprite sheets
		// Each sprite entry maps a name to its sheet source and pixel coordinates
		this.sprites = {
			// Player ship - uses the full mainShip image (dimensions loaded dynamically)
			mainShip: { sheet: 'mainShip', sprite: { x: 0, y: 0, width: 0, height: 0 } }, // Dimensions set dynamically when image loads
			
			// Enemy explosion frames (7 frames total, 192×192 pixels each)
			// Top row contains frames 0-4, bottom row contains frames 5-6
			// This explosion is used for both enemy and player deaths (scaled down to 96×96)
			enemyExplosion0: { sheet: 'enemyExplosion', sprite: this.sheets.enemyExplosion.getSprite(0, 0, 192, 192) },
			enemyExplosion1: { sheet: 'enemyExplosion', sprite: this.sheets.enemyExplosion.getSprite(192, 0, 192, 192) },
			enemyExplosion2: { sheet: 'enemyExplosion', sprite: this.sheets.enemyExplosion.getSprite(384, 0, 192, 192) },
			enemyExplosion3: { sheet: 'enemyExplosion', sprite: this.sheets.enemyExplosion.getSprite(576, 0, 192, 192) },
			enemyExplosion4: { sheet: 'enemyExplosion', sprite: this.sheets.enemyExplosion.getSprite(768, 0, 192, 192) },
			enemyExplosion5: { sheet: 'enemyExplosion', sprite: this.sheets.enemyExplosion.getSprite(0, 192, 192, 192) },
			enemyExplosion6: { sheet: 'enemyExplosion', sprite: this.sheets.enemyExplosion.getSprite(480, 192, 192, 192) },
			
			// Blue Bumble enemy frames (2 frames, looping animation)
			// Frame 0: x=8, y=0, width=13, height=48 (full height to avoid cutoff)
			// Frame 1: x=29, y=0, width=9, height=48
			blueNEW0: { sheet: 'blueNEW', sprite: this.sheets.blueNEW.getSprite(8, 0, 13, 48) },
			blueNEW1: { sheet: 'blueNEW', sprite: this.sheets.blueNEW.getSprite(29, 0, 9, 48) },
			
			// Red Bumble enemy frames (2 frames, looping animation)
			// Same coordinates as Blue Bumble, but from redNEW sprite sheet
			redNEW0: { sheet: 'redNEW', sprite: this.sheets.redNEW.getSprite(8, 0, 13, 48) },
			redNEW1: { sheet: 'redNEW', sprite: this.sheets.redNEW.getSprite(29, 0, 9, 48) },
			
			
			// Grey Alien enemy frames (8 frames total: 6 entry + 2 idle)
			// Each frame is 16×36 pixels, extracted from the greyDown sprite sheet
			// Frames 0-5 are for entry animation (play once), frames 6-7 loop continuously
			greyDown0: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(2, 0, 16, 36) },
			greyDown1: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(20, 0, 16, 36) },
			greyDown2: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(37, 0, 16, 36) },
			greyDown3: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(54, 0, 16, 36) },
			greyDown4: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(70, 0, 16, 36) },
			greyDown5: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(86, 0, 16, 36) },
			greyDown6: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(102, 0, 16, 36) }, // Idle frame 0
			greyDown7: { sheet: 'greyDown', sprite: this.sheets.greyDown.getSprite(119, 0, 16, 36) }, // Idle frame 1
			
			// Purple Alien enemy frames (same structure as Grey Alien)
			purpleDown0: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(2, 0, 16, 36) },
			purpleDown1: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(20, 0, 16, 36) },
			purpleDown2: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(37, 0, 16, 36) },
			purpleDown3: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(54, 0, 16, 36) },
			purpleDown4: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(70, 0, 16, 36) },
			purpleDown5: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(86, 0, 16, 36) },
			purpleDown6: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(102, 0, 16, 36) },
			purpleDown7: { sheet: 'purpleDown', sprite: this.sheets.purpleDown.getSprite(119, 0, 16, 36) },
			
			// Yellow Alien enemy frames (same structure as Grey and Purple Aliens)
			yellowDown0: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(2, 0, 16, 36) },
			yellowDown1: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(20, 0, 16, 36) },
			yellowDown2: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(37, 0, 16, 36) },
			yellowDown3: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(54, 0, 16, 36) },
			yellowDown4: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(70, 0, 16, 36) },
			yellowDown5: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(86, 0, 16, 36) },
			yellowDown6: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(102, 0, 16, 36) },
			yellowDown7: { sheet: 'yellowDown', sprite: this.sheets.yellowDown.getSprite(119, 0, 16, 36) },
		};
		
		// Animation sequences - define which sprite frames belong to each animation
		// Each animation name maps to an array of sprite names in playback order
		this.animations = {
			// Enemy explosion animation (7 frames, plays once, used for both enemies and player)
			enemyExplode: ['enemyExplosion0', 'enemyExplosion1', 'enemyExplosion2', 'enemyExplosion3', 'enemyExplosion4', 'enemyExplosion5', 'enemyExplosion6'],
			
			// Blue Bumble enemy animation (2 frames, loops continuously)
			enemyBlueBumble: ['blueNEW0', 'blueNEW1'],
			
			// Red Bumble enemy animation (2 frames, loops continuously)
			enemyRedBumble: ['redNEW0', 'redNEW1'],
			
			// Grey Alien enemy animations
			// Entry animation plays once when enemy first appears, then switches to idle
			enemyGreyDownEntry: ['greyDown0', 'greyDown1', 'greyDown2', 'greyDown3', 'greyDown4', 'greyDown5'],
			enemyGreyDownIdle: ['greyDown6', 'greyDown7'], // Loops continuously after entry
			
			// Purple Alien enemy animations (same structure as Grey Alien)
			enemyPurpleDownEntry: ['purpleDown0', 'purpleDown1', 'purpleDown2', 'purpleDown3', 'purpleDown4', 'purpleDown5'],
			enemyPurpleDownIdle: ['purpleDown6', 'purpleDown7'],
			
			// Yellow Alien enemy animations (same structure as Grey and Purple Aliens)
			enemyYellowDownEntry: ['yellowDown0', 'yellowDown1', 'yellowDown2', 'yellowDown3', 'yellowDown4', 'yellowDown5'],
			enemyYellowDownIdle: ['yellowDown6', 'yellowDown7']
		};
		
		// Create Animation objects for each animation sequence
		this.animationObjects = {};
		this.initializeAnimations();
	}
	
	/**
	 * Initialize all animation objects that control frame timing and playback
	 * 
	 * Each Animation object manages the timing for one animation sequence,
	 * handling frame advancement, looping behavior, and completion status.
	 * 
	 * Animation parameters:
	 * - First argument: Array of frame indices (relative to the sprite array)
	 * - Second argument: Time per frame in seconds
	 * - Third argument (optional): Number of times to play (undefined = infinite loop, 1 = play once)
	 */
	initializeAnimations() {
		// Enemy explosion animation - plays once when enemies or player are destroyed
		// 7 frames at 0.07s each = 0.49s total duration
		// Used for both enemy and player explosions (scaled differently)
		this.animationObjects.enemyExplode = new Animation(
			[0, 1, 2, 3, 4, 5, 6],
			0.07,
			1 // Play once
		);
		
		// Blue Bumble enemy animation - simple 2-frame looping animation
		// Creates a bobbing/flapping effect for the bumblebee-like enemy
		this.animationObjects.enemyBlueBumble = new Animation(
			[0, 1],
			0.2 // 0.2 seconds per frame = 0.4s total cycle time
		);
		
		// Red Bumble enemy animation - same structure as Blue Bumble
		this.animationObjects.enemyRedBumble = new Animation(
			[0, 1],
			0.2
		);
		
		// Grey Alien enemy animations
		// Entry animation plays once when enemy first appears (6 frames)
		this.animationObjects.enemyGreyDownEntry = new Animation(
			[0, 1, 2, 3, 4, 5],
			0.15, // 0.15s per frame = 0.9s total
			1 // Play once
		);
		// Idle animation loops continuously after entry completes (2 frames)
		this.animationObjects.enemyGreyDownIdle = new Animation(
			[0, 1], // Maps to frames 6-7 in the sprite array
			0.15 // 0.15s per frame = 0.3s total cycle time
		);
		
		// Purple Alien enemy animations (same timing as Grey Alien)
		this.animationObjects.enemyPurpleDownEntry = new Animation(
			[0, 1, 2, 3, 4, 5],
			0.15,
			1
		);
		this.animationObjects.enemyPurpleDownIdle = new Animation(
			[0, 1],
			0.15
		);
		
		// Yellow Alien enemy animations (same timing as Grey and Purple Aliens)
		this.animationObjects.enemyYellowDownEntry = new Animation(
			[0, 1, 2, 3, 4, 5],
			0.15,
			1
		);
		this.animationObjects.enemyYellowDownIdle = new Animation(
			[0, 1],
			0.15
		);
		
		// Map animation names to their frame array names
		// This allows us to look up which sprite array to use for a given animation name
		this.animationNameMap = {
			enemyExplode: 'enemyExplode',
			enemyBlueBumble: 'enemyBlueBumble',
			enemyRedBumble: 'enemyRedBumble',
			enemyGreyDownEntry: 'enemyGreyDownEntry',
			enemyGreyDownIdle: 'enemyGreyDownIdle',
			enemyPurpleDownEntry: 'enemyPurpleDownEntry',
			enemyPurpleDownIdle: 'enemyPurpleDownIdle',
			enemyYellowDownEntry: 'enemyYellowDownEntry',
			enemyYellowDownIdle: 'enemyYellowDownIdle'
		};
	}
	
	/**
	 * Draw a single sprite at the specified position
	 * 
	 * @param {string} spriteName - Name of the sprite to draw (e.g., 'mainShip', 'enemyExplosion0')
	 * @param {number} x - X position on canvas
	 * @param {number} y - Y position on canvas
	 * @param {number} scale - Scale multiplier (default: 1.0, 2.0 = double size, 0.5 = half size)
	 * @returns {boolean} True if sprite was drawn successfully, false otherwise
	 */
	draw(spriteName, x, y, scale = 1) {
		const spriteData = this.sprites[spriteName];
		if (!spriteData) {
			return false;
		}
		
		const sheet = this.sheets[spriteData.sheet];
		if (!sheet || !sheet.isReady()) {
			return false;
		}
		
		// Special handling for mainShip - dimensions are loaded dynamically from the image
		// This allows us to use the full image without hardcoding dimensions
		let sprite = spriteData.sprite;
		if (spriteName === 'mainShip') {
			// Wait for image to load, then extract dimensions
			if (sheet.image.naturalWidth > 0 && (sprite.width === 0 || sprite.height === 0)) {
				sprite = sheet.getSprite(0, 0, sheet.image.naturalWidth, sheet.image.naturalHeight);
				spriteData.sprite = sprite; // Cache the dimensions for next time
			} else if (sprite.width === 0 || sprite.height === 0) {
				// Image not ready yet, can't draw
				return false;
			}
		} else if (!sprite || sprite.width === 0) {
			return false;
		}
		
		return sheet.draw(sprite, x, y, scale);
	}
	
	/**
	 * Get the array of sprite names for an animation sequence
	 * 
	 * @param {string} animName - Name of the animation (e.g., 'enemyBlueBumble')
	 * @returns {string[]} Array of sprite names in playback order
	 */
	getAnimation(animName) {
		return this.animations[animName] || [];
	}
	
	/**
	 * Get the Animation object that controls timing for an animation
	 * 
	 * @param {string} animName - Name of the animation
	 * @returns {Animation|null} The Animation object, or null if not found
	 */
	getAnimationObject(animName) {
		return this.animationObjects[animName];
	}
	
	/**
	 * Get the current sprite name for an animation based on its current frame
	 * 
	 * This method combines the animation timing (which frame we're on) with
	 * the sprite array (which sprites to use) to determine what sprite to draw.
	 * 
	 * @param {string} animName - Name of the animation
	 * @returns {string|null} Name of the current sprite to draw, or null if invalid
	 */
	getAnimationSprite(animName) {
		const anim = this.animationObjects[animName];
		if (!anim) {
			return null;
		}
		
		const frameIndex = anim.getCurrentFrame();
		// Look up which sprite array this animation uses
		const frameArrayName = this.animationNameMap[animName] || animName;
		const frameNames = this.animations[frameArrayName];
		
		if (!frameNames || frameIndex >= frameNames.length) {
			return null;
		}
		
		return frameNames[frameIndex];
	}
	
	/**
	 * Draw an animation at the specified position
	 * 
	 * This is a convenience method that combines getAnimationSprite() and draw()
	 * to draw the current frame of an animation.
	 * 
	 * @param {string} animName - Name of the animation to draw
	 * @param {number} x - X position on canvas
	 * @param {number} y - Y position on canvas
	 * @param {number} scale - Scale multiplier
	 * @returns {boolean} True if animation frame was drawn successfully
	 */
	drawAnimation(animName, x, y, scale = 1) {
		const spriteName = this.getAnimationSprite(animName);
		if (!spriteName) return false;
		
		return this.draw(spriteName, x, y, scale);
	}
	
	/**
	 * Update all animations (advance frames based on delta time)
	 * 
	 * This must be called every frame to keep animations playing correctly.
	 * 
	 * @param {number} dt - Delta time (time since last frame) in seconds
	 */
	update(dt) {
		Object.values(this.animationObjects).forEach(anim => {
			if (anim) anim.update(dt);
		});
	}
	
	/**
	 * Check if all sprite sheets have finished loading
	 * 
	 * @returns {boolean} True if all sheets are ready, false otherwise
	 */
	isLoaded() {
		return Object.values(this.sheets).every(sheet => sheet.isReady());
	}
}
