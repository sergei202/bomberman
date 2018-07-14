export class Enemy extends Phaser.Physics.Arcade.Sprite {
	speed = 100;
	dir = 2;		// 0=up, 1=right, 2=down, 3=left
	dirChangeTimer = 0;
	alive = true;

	constructor(params) {
		super(params.scene, params.x, params.y, 'enemy');

		params.scene.physics.world.enable(this);
		params.scene.add.existing(this);

		// this.body.immovable = true;

		this.setSize(16,16,true);
		this.setOrigin(0.5,0.75);

		this.switchDir();
	}


	public update() {
		if((this.body.velocity.x+this.body.velocity.y)===0) return this.switchDir();

		if(this.dirChangeTimer>100) {
			var dirs = [];
			if(this.dir===0 || this.dir===2) {
				// console.log('dir: %o', this.dir);
				if(!this.body.blocked.right && !this.body.touching.right) {
					// console.log('right: %o %o', this.body.blocked.right, this.body.touching.right);
					dirs.push(this.walkRight);
				}
				if(!this.body.blocked.left  && !this.body.touching.left) {
					// console.log('left: %o %o', this.body.blocked.left, this.body.touching.left);
					dirs.push(this.walkLeft);
				}
			}
			if(this.dir===1 || this.dir===3) {
				if(!this.body.blocked.up   && !this.body.touching.up)   dirs.push(this.walkUp);
				if(!this.body.blocked.down && !this.body.touching.down) dirs.push(this.walkDown);
			}

			if(dirs.length) {
				// console.log('dirs: %o', dirs.map(f => f.name).join(', '));
				Phaser.Math.RND.pick(dirs).bind(this)();
				this.dirChangeTimer = 0;
			}
		}
		this.dirChangeTimer++;
	}
	
	exploded() {
		if(!this.alive) return;
		this.alive = false;
		this.scene.add.tween({
			targets: this,
			ease: 'Power1',
			alpha: '-=2',
			duration: 500,
			onComplete: () => {
				var enemiesLeft = this.scene['enemies'].getChildren().length;
				console.log('exploded() enemiesLeft=%o', enemiesLeft);
				if(enemiesLeft===1) {
					this.scene['player'].won();
				}
				this.destroy();
			}
		});
	}

	onCollide(object) {
		// console.log('enemy collide: object=%o, touching=%o, blocked=%o', object, this.body.touching, this.body.blocked);
		this.switchDir();
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
