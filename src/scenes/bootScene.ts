export class BootScene extends Phaser.Scene {
	constructor() {
		super({key:'BootScene'});
	}

	preload() {
		this.load.image('tileset', 'assets/tileset.png');
		this.load.tilemapTiledJSON('level1',	'assets/level1.json');
		this.load.tilemapTiledJSON('level2',	'assets/level2.json');
		this.load.tilemapTiledJSON('level3',	'assets/level3.json');
		this.load.spritesheet('player',		'assets/player.png',	{frameWidth:32, frameHeight:32});
		this.load.spritesheet('enemy',		'assets/enemy.png',		{frameWidth:32, frameHeight:32});
		this.load.spritesheet('bomb',		'assets/bomb.png',		{frameWidth:32, frameHeight:32});
		this.load.spritesheet('explosion',	'assets/explosion.png',	{frameWidth:32, frameHeight:32});
	}

	update() {
		this.scene.start('TitleScene');
	}
}
