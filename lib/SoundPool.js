export default class SoundPool {
	/**
	 * Manages an array of sounds so that we can play the same sound
	 * multiple times in our game without having to wait for one sound
	 * to be finished playing before playing the same sound again.
	 *
	 * @param {String} source
	 * @param {Number} size
	 * @see https://blog.sklambert.com/html5-canvas-game-html5-audio-and-finishing-touches/
	 */
	constructor(source, size = 1, volume, loop = false) {
		this.source = source;
		this.size = size;
		this.volume = volume;
		this.loop = loop;
		this.pool = [];
		this.currentSound = 0;

		this.initializePool();
	}

	initializePool() {
		for (let i = 0; i < this.size; i++) {
			const audio = new Audio(this.source);

			audio.volume = this.volume;
			audio.loop = this.loop;

			this.pool.push(audio);
		}
	}

	/**
	 * Checks if the currentSound is ready to play, plays the sound,
	 * then increments the currentSound counter.
	 * Always plays immediately by finding an available sound or restarting.
	 */
	play() {
		// Try to find an available sound in the pool
		let soundPlayed = false;
		for (let i = 0; i < this.size; i++) {
			const soundIndex = (this.currentSound + i) % this.size;
			const sound = this.pool[soundIndex];
			
			// If sound is not playing (at start, ended, or paused), use it
			if (sound.currentTime === 0 || sound.ended || sound.paused) {
				// Reset and play
				sound.currentTime = 0;
				sound.play().catch(() => {}); // Ignore promise rejection (autoplay policy)
				soundPlayed = true;
				this.currentSound = (soundIndex + 1) % this.size;
				break;
			}
		}
		
		// If all sounds are playing, restart the current one (force play)
		if (!soundPlayed && this.size > 0) {
			const sound = this.pool[this.currentSound];
			sound.currentTime = 0;
			sound.play().catch(() => {}); // Ignore promise rejection
			this.currentSound = (this.currentSound + 1) % this.size;
		}
	}

	pause() {
		this.pool[this.currentSound].pause();
	}

	isPaused() {
		return this.pool[this.currentSound].paused;
	}

	stop() {
		this.pause();
		this.pool[this.currentSound].currentTime = 0;
	}
}
