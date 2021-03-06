import { Bomb } from '../objects/bomb';

export class Player extends Phaser.Physics.Arcade.Sprite {
	cursors:any;
	speed = 1000;
	dir = 2;		// 0=up, 1=right, 2=down, 3=left
	spacebar;
	alive = true;
	lastBombDrop = 0;

	constructor(params) {
		super(params.scene, params.x, params.y, 'player');
		window['player'] = this;

		this.cursors = params.scene.input.keyboard.createCursorKeys();
		this.spacebar = params.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		params.scene.add.existing(this);
		params.scene.physics.world.enable(this);

		// this.body.immovable = true;

		this.body.maxVelocity = <any>{x:150,y:150};
		this.setSize(16,16,true);
		this.setOrigin(0.5,0.75);
	}


	public update() {
		this.handleInput();
	}

	public dropBomb() {
		new Bomb({scene:this.scene, x:this.body.x+8, y:this.body.y+8});
		this.lastBombDrop = 0;
	}

	public exploded() {
		if(!this.alive) return;
		this.alive = false;
		this.scene.cameras.main.shakeEffect.start(1000);
		setTimeout(() => this.scene.scene.restart(), 1000);
	}

	public won() {
		var nextLevel = this.scene['level']+1;
		this.scene.sys.add.text(this.scene['width']/6+20, 200, 'You won!', {fontSize:80, stroke:'#fff'});
		if(nextLevel<=3) {
			this.scene.sys.add.text(this.scene['width']/6+20, 300, 'Level '+nextLevel, {fontSize:80, stroke:'#fff'});
			setTimeout(() => this.scene.scene.restart({level:nextLevel}), 1000);
		} else {
			this.scene.sys.add.text(10, 300, 'No more levels!  You really won!', {fontSize:80, stroke:'#fff'});
		}
	}

	public handleInput() {
		if(Phaser.Input.Keyboard.JustDown(this.spacebar) && this.lastBombDrop>10) this.dropBomb();

		if(this.cursors.left.isDown) {
			this.anims.play('player-walk-right', true);
			this.dir = 3;
			// this.body.setVelocity(-this.speed,0);
			this.setAcceleration(-this.speed,0);
		} else if(this.cursors.right.isDown) {
			this.anims.play('player-walk-right', true);
			this.dir = 1;
			this.setAcceleration(this.speed,0);
		} else if(this.cursors.down.isDown) {
			this.anims.play('player-walk-down', true);
			this.dir = 2;
			this.setAcceleration(0,this.speed);
		} else if(this.cursors.up.isDown) {
			this.anims.play('player-walk-up', true);
			this.dir = 0;
			this.setAcceleration(0,-this.speed);
		} else {
			switch(this.dir) {
				case 0:
					this.anims.play('player-idle-up', true); break;
				case 1:
				case 3:
					this.anims.play('player-idle-right', true); break;
				case 2:
					this.anims.play('player-idle-down', true); break;
			}
			this.setAcceleration(0,0);
			this.setVelocity(0,0);
		}

		this.flipX = this.dir===3;

		this.lastBombDrop++;
	}

};
