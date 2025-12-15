/**
 * GameStateName - Enumeration of all game states
 * 
 * This enum defines all possible states in the game's state machine.
 * Each state represents a different screen or mode:
 * 
 * - TitleScreen: Main menu where players start the game
 * - Play: Active gameplay state
 * - Pause: Paused gameplay (currently not implemented)
 * - GameOver: Displayed when player loses (runs out of lives)
 * - Victory: Displayed when player completes all 3 waves
 * - HighScore: Shows high score leaderboard
 * - WaveComplete: Transition screen between waves
 */
const GameStateName = {
	TitleScreen: 'title-screen',
	Play: 'play',
	Pause: 'pause',
	HighScore: 'high-score',
	GameOver: 'game-over',
	Victory: 'victory',
	WaveComplete: 'wave-complete',
};

export default GameStateName;
