/**
 * Handles loading and drawing from a single sprite sheet image
 */
export default class SpriteSheet {
	constructor(imagePath, context) {
		this.image = new Image();
		this.image.src = imagePath;
		this.loaded = false;
		this.context = context;
		
		this.image.onload = () => {
			this.loaded = true;
			console.log(`✓ Loaded: ${imagePath}`);
		};
		
		this.image.onerror = () => {
			console.error(`✗ Failed to load: ${imagePath}`);
		};
	}
	
	getSprite(x, y, width, height) {
		return { x, y, width, height };
	}
	
	draw(sprite, dx, dy, scale = 1) {
		if (!this.loaded || !this.image.complete || !this.image.naturalWidth) {
			return false;
		}
		
		try {
			this.context.drawImage(
				this.image,
				sprite.x, sprite.y, sprite.width, sprite.height,
				dx, dy, sprite.width * scale, sprite.height * scale
			);
			return true;
		} catch (e) {
			console.error('Error drawing sprite:', e);
			return false;
		}
	}
	
	isReady() {
		return this.loaded && this.image.complete && this.image.naturalWidth > 0;
	}
}

