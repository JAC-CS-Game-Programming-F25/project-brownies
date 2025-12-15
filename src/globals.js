/**
 * Globals - Shared game resources and utilities
 * 
 * This module exports all globally accessible game resources that need to be
 * shared across multiple game states and entities. This includes:
 * - Canvas and rendering context
 * - Asset managers (Images, Fonts, Sounds)
 * - Game state machine
 * - Input handler
 * - Timer for delta time calculation
 * - Sprite manager for sprite rendering
 * - Game constants (canvas dimensions)
 * 
 * These are initialized in main.js and available throughout the game codebase.
 */

import Fonts from '../lib/Fonts.js';
import Images from '../lib/Images.js';
import Sounds from '../lib/Sounds.js';
import StateMachine from '../lib/StateMachine.js';
import Timer from '../lib/Timer.js';
import Input from '../lib/Input.js';
import SpriteManager from './services/SpriteManager.js';

export const canvas = document.createElement('canvas');
export const context =
	canvas.getContext('2d') || new CanvasRenderingContext2D();

// Replace these values according to how big you want your canvas.
export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;

const resizeCanvas = () => {
	const scaleX = window.innerWidth / CANVAS_WIDTH;
	const scaleY = window.innerHeight / CANVAS_HEIGHT;
	const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

	canvas.style.width = `${CANVAS_WIDTH * scale}px`;
	canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
};

// Listen for canvas resize events
window.addEventListener('resize', resizeCanvas);

resizeCanvas(); // Call once to scale initially

export const keys = {};
export const images = new Images(context);
export const fonts = new Fonts();
export const stateMachine = new StateMachine();
export const timer = new Timer();
export const input = new Input(canvas);
export const sounds = new Sounds();

// Sprite manager - initialized with context
export const spriteManager = new SpriteManager(context);
