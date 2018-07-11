export class BootScene extends Phaser.Scene {
	constructor() {
		super({key:'BootScene'});
	}

	preload() {
		this.load.image('tileset', 'assets/tileset.png');
		this.load.tilemapTiledJSON('map', 'assets/level2.json');
		this.load.spritesheet('player', 'assets/player.png', {
			frameWidth: 32,
			frameHeight: 32
		});
		this.load.spritesheet('enemy', 'assets/enemy.png', {
			frameWidth: 32,
			frameHeight: 32
		});
	}

	update() {
		this.scene.start('GameScene');
	}
}
