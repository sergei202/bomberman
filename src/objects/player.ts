export class Player extends Phaser.Physics.Arcade.Sprite {
	cursors:any;
	speed = 128;
	dir = 2;		// 0=up, 1=right, 2=down, 3=left

	constructor(params) {
		super(params.scene, params.x, params.y, 'player');
		window['player'] = this;

		this.cursors = params.scene.input.keyboard.createCursorKeys();

		// params.scene.gridPhysics.world.enable(this);


		params.scene.add.existing(this);
		params.scene.physics.world.enable(this);
		this.setCollideWorldBounds(true);


		this.setSize(16,16,true);
		this.setOrigin(0.5);

		// (<any>this.body).collidible = true;
		// this.body.immovable = true;
		// (<any>this.body).baseVelocity = 50;

	}


	public update() {
		this.handleInput();
	}


	public handleInput() {
		this.body.setVelocity(0);
		if(this.cursors.left.isDown) {
			this.anims.play('player-walk-right', true);
			this.dir = 3;
			this.body.setVelocity(-this.speed,0);
		} else if(this.cursors.right.isDown) {
			this.anims.play('player-walk-right', true);
			this.dir = 1;
			this.body.setVelocity(this.speed,0);
		} else if(this.cursors.down.isDown) {
			this.anims.play('player-walk-down', true);
			this.dir = 2;
			this.body.setVelocity(0,this.speed);
		} else if(this.cursors.up.isDown) {
			this.anims.play('player-walk-up', true);
			this.dir = 0;
			this.body.setVelocity(0,-this.speed);
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
		}

		this.flipX = this.dir===3;
	}

};
