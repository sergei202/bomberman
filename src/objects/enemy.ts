 export class Enemy extends Phaser.Physics.Arcade.Sprite {
	cursors:any;
	speed = 64;
	dir = 2;		// 0=up, 1=right, 2=down, 3=left
	dirChangeTimer = 0;

	constructor(params) {
		super(params.scene, params.x, params.y, 'enemy');

		params.scene.physics.world.enable(this);
		this.setCollideWorldBounds(true);

		params.scene.add.existing(this);

	}


	public update() {
		if(!this.body.touching.none || !this.body.blocked.none || (this.body.velocity.x+this.body.velocity.y)===0) return this.switchDir();

		if(this.dirChangeTimer>500) {
			var dirs = [];
			if(this.dir===0 || this.dir===2) {
				console.log('dir: %o', this.dir)
				if(!this.body.blocked.right && !this.body.touching.right) {
					console.log('right: %o %o', this.body.blocked.right, this.body.touching.right);
					dirs.push(this.walkRight);
				}
				if(!this.body.blocked.left  && !this.body.touching.left) {
					console.log('left: %o %o', this.body.blocked.left, this.body.touching.left);
					dirs.push(this.walkLeft);
				}
			}
			// if(this.dir===1 || this.dir===3) {
			// 	if(!this.body.blocked.up   && !this.body.touching.up)   dirs.push(this.walkUp);
			// 	if(!this.body.blocked.down && !this.body.touching.down) dirs.push(this.walkDown);
			// }

			// if(false && dirs.length) {
			// 	// console.log('dirs: %o', dirs.map(f => f.name).join(', '));
			// 	Phaser.Math.RND.pick(dirs).bind(this)();
			// 	this.dirChangeTimer = 0;
			// }
		}
		// this.dirChangeTimer++;
	}

	switchDir() {
		var dirs = [];
		if(!this.body.blocked.right && this.dir!==3)	dirs.push(this.walkRight);
		if(!this.body.blocked.left  && this.dir!==1)	dirs.push(this.walkLeft);
		if(!this.body.blocked.up    && this.dir!==2)	dirs.push(this.walkUp);
		if(!this.body.blocked.down  && this.dir!==0)	dirs.push(this.walkDown);

		Phaser.Math.RND.pick(dirs).bind(this)();
	}

	walkUp() {
		if(this.body.touching.up || this.body.blocked.up) return false;
		this.dir = 0;
		this.setVelocityX(0);
		this.setVelocityY(-this.speed);
		// this.flipX = false;
		this.anims.play('enemy-walk-up', true);
		this.dirChangeTimer = 0;
	}

	walkRight() {
		if(this.body.touching.right || this.body.blocked.right) return false;
		this.dir = 1;
		this.setVelocityX(this.speed);
		this.setVelocityY(0);
		this.flipX = false;
		this.anims.play('enemy-walk-right', true);
		this.dirChangeTimer = 0;
	}

	walkDown() {
		if(this.body.touching.down || this.body.blocked.down) return false;
		this.dir = 2;
		this.setVelocityX(0);
		this.setVelocityY(this.speed);
		// this.flipX = false;
		this.anims.play('enemy-walk-down', true);
		this.dirChangeTimer = 0;
	}

	walkLeft() {
		if(this.body.touching.left || this.body.blocked.left) return false;
		this.dir = 3;
		this.setVelocityX(-this.speed);
		this.setVelocityY(0);
		this.flipX = true;
		this.anims.play('enemy-walk-right', true);
		this.dirChangeTimer = 0;
	}
}