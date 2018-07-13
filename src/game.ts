/// <reference path='./phaser.d.ts'/>

import 'phaser';
import { BootScene } from './scenes/bootScene';
import { GameScene } from './scenes/gameScene';

// main game configuration
const config: GameConfig = {
	width:  800,
	height: 800,
	type: Phaser.AUTO,
	parent: 'game',
	scene: [BootScene,GameScene],
	backgroundColor: '#fff',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y:0},
			debug: true
		}
	}
};

// game class
export class Game extends Phaser.Game {
	constructor(config:GameConfig) {
		super(config);
	}
}

// when the page is loaded, create our game instance
window.onload = () => {

	// config.width  = window.innerWidth;
	// config.height = window.innerHeight;

	var game = new Game(config);
};
