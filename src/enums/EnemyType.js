/**
 * EnemyType - Enumeration of all enemy types
 * 
 * This enum defines all enemy types that can appear in the game.
 * Each type corresponds to a specific enemy class with unique:
 * - Animations (entry/idle sequences or looping animations)
 * - Point values (how many points defeating them gives)
 * - Visual appearance (sprite sheets)
 * 
 * Enemy Types:
 * - GreyAlien, PurpleAlien, YellowAlien: Alien enemies with entry + idle animations
 * - BlueBumble, RedBumble: Bumblebee-like enemies with simple 2-frame looping animations
 */
const EnemyType = {
	GreyAlien: 'greyAlien',
	PurpleAlien: 'purpleAlien',
	YellowAlien: 'yellowAlien',
	BlueBumble: 'blueBumble',
	RedBumble: 'redBumble',
};

export default EnemyType;