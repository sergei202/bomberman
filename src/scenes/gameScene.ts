import { Player } from '../objects/player';
import { Enemy } from '../objects/enemy';
import { Bomb } from '../objects/bomb';

export class GameScene extends Phaser.Scene {
	width:number;
	height:number;
	player:Player;
	enemies:Phaser.GameObjects.Group;
	bombs:Phaser.GameObjects.Group;
	explosions:Phaser.GameObjects.Group;
	map;
	level;

	constructor() {
		super({key:'GameScene'});
		window['gameScene'] = this;
	}

	init(data) {
		console.log('GameScene init()\t data=%o', data);
		this.level = data.level;
	}

	preload() {
		this.width = <any>this.scene.systems.game.config['width'];
		this.height = <any>this.scene.systems.game.config['height'];
	}

	create() {
		var map = this.make.tilemap({key:'level'+this.level});
		this.map = map;
		var tiles = map.addTilesetImage('tileset', 'tileset');

		var bgLayer = map.createDynamicLayer('background', tiles, 0,0);
		var wallLayer = map.createDynamicLayer('walls', tiles, 0,0);

		wallLayer.setCollisionByExclusion([-1], true);

		this.physics.world.bounds.width  = bgLayer.width;
		this.physics.world.bounds.height = bgLayer.height;
		this.physics.world.setBoundsCollision(true, true, true, true);

		this.initAnims();

		this.enemies = this.add.group();
		this.bombs = this.add.group();
		this.explosions = this.add.group();
		window['enemies'] = this.enemies.children.entries;

		var objectLayer = map.getObjectLayer('objects');
		objectLayer.objects.forEach(object => {
			if(object.name==='player') {
				this.player = new Player({scene:this, x:object['x']+16, y:object['y']-24});
			}
			if(object.type==='enemy') {
				// if(!this.enemies.children.entries.length)
				this.enemies.add(new Enemy({scene:this, x:object['x']+16, y:object['y']-16}));
			}
		});

		this.physics.add.collider(this.explosions, this.bombs, (a,b) => {
			if((a as any).explode) (a as any).explode(b);
			if((b as any).explode) (b as any).explode(a);
		});
		this.physics.add.collider(this.bombs, this.bombs);
		this.physics.add.collider(this.bombs, wallLayer);
		this.physics.add.collider(wallLayer, this.player);
		this.physics.add.collider(this.bombs, this.player);
		this.physics.add.collider(this.enemies, this.enemies, (a,b) => {
			if((a as any).onCollide) (a as any).onCollide(b);
			if((b as any).onCollide) (b as any).onCollide(a);
		});
		this.physics.add.collider(this.bombs, this.enemies, (a,b) => {
			if((a as any).onCollide) (a as any).onCollide(b);
			if((b as any).onCollide) (b as any).onCollide(a);
		});
		this.physics.add.collider(<any>[wallLayer,this.player], this.enemies, (a,b) => {
			if((a as any).onCollide) (a as any).onCollide(b);
			if((b as any).onCollide) (b as any).onCollide(a);
		});

		this.physics.add.collider(this.explosions, this.player, (explosion,player) => {
			console.log('player explosion collision: explosion=%o, player=%o', explosion,player);
			(player as any).exploded();
		});
		this.physics.add.collider(this.explosions, this.enemies, (explosion,enemy) => {
			console.log('enemy explosion collision: explosion=%o, enemy=%o', explosion,enemy);
			(enemy as any).exploded();
		});
	}

	update() {
		this.player.update();
		this.enemies.getChildren().forEach(e => e.update());
	}

	initAnims() {
		var anims = this.anims;
		anims.create({
			key:'player-walk-right', frameRate:10, repeat:0,
			frames: anims.generateFrameNumbers('player', {start:5, end:7})
		});
		anims.create({
			key: 'player-idle-right', frameRate:10, repeat:0,
			frames: [{key:'player', frame:4}]
		});
		anims.create({
			key: 'player-walk-down', frameRate:10, repeat:0,
			frames: anims.generateFrameNumbers('player', {start:2, end:3})
		});
		anims.create({
			key: 'player-idle-down', frameRate:10, repeat:0,
			frames: [{key:'player', frame:1}]
		});
		anims.create({
			key: 'player-walk-up', frameRate:10, repeat:0,
			frames: anims.generateFrameNumbers('player', {start:8, end:9})
		});
		anims.create({
			key: 'player-idle-up', frameRate:10, repeat:0,
			frames: [{key:'player', frame:0}]
		});

		anims.create({
			key:'enemy-walk-right', frameRate:10, repeat:-1,
			frames: anims.generateFrameNumbers('enemy', {start:5, end:7})
		});
		anims.create({
			key: 'enemy-idle-right', frameRate:10, repeat:0,
			frames: [{key:'player', frame:4}]
		});
		anims.create({
			key: 'enemy-walk-down', frameRate:10, repeat:-1,
			frames: anims.generateFrameNumbers('enemy', {start:2, end:3})
		});
		anims.create({
			key: 'enemy-idle-down', frameRate:10, repeat:0,
			frames: [{key:'enemy', frame:1}]
		});
		anims.create({
			key: 'enemy-walk-up', frameRate:10, repeat:-1,
			frames: anims.generateFrameNumbers('enemy', {start:8, end:9})
		});
		anims.create({
			key: 'enemy-idle-up', frameRate:10, repeat:0,
			frames: [{key:'enemy', frame:0}]
		});

		anims.create({
			key:'bomb', frameRate:4, repeat:0,
			frames: anims.generateFrameNumbers('bomb', {start:0, end:7})
		});
	}

}
