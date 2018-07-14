export class Explosion extends Phaser.GameObjects.Group {
	radius = 3;
	scene;
	x;
	y;

	constructor(params) {
		super(params.scene);
		this.scene = params.scene;
		this.x = params.x;
		this.y = params.y;

		console.log('explosion: %o', this);
		// params.scene.add.existing(this);
		// params.scene.physics.world.enable(this);
		// params.scene.bombs.add(this);

		// this.body.immovable = true;

		// this.setSize(16,16,true);
		// this.setOrigin(0.5);

		// this.setFrame(2);


		var center = new Phaser.Physics.Arcade.Sprite(
			params.scene,
			params.x,
			params.y,
			'explosion',
			2
		);
		this.add(center);
		params.scene.physics.world.enable(center);
		params.scene.add.existing(center);
		params.scene.explosions.add(center);

		this.createArm(1, 0);
		this.createArm(-1,0);
		this.createArm(0, 1);
		this.createArm(0,-1);

		window['explosion'] = this;

		this.scene.tweens.add({
			targets: this.getChildren(),
			scale: 0,
			ease: 'Power1',
			duration: 500,
			onComplete: () => this.kill()
		});

	}


	kill() {
		console.log('explosion kill() children=%o', this.children.entries.length);
		while(this.getChildren().length) this.getChildren().map(e => e.destroy());	// Strange bug
		this.destroy();
	}


	createArm(gx,gy, step=1) {		// grid units
		// console.log('createArm: gx=%o, gy=%o, step=%o', gx,gy,step);

		var x = this.x + 32*gx;
		var y = this.y + 32*gy;

		if(this.scene.map.getTileAtWorldXY(x,y)) return;

		var dx = Math.sign(gx);
		var dy = Math.sign(gy);
		var sprite = new Phaser.Physics.Arcade.Sprite(this.scene, x, y, 'explosion', 1);

		if(gy) sprite.angle = 90;

		var tile = this.scene.map.getTileAtWorldXY(x+dx*32,y+dy*32);
		// console.log('createArm: tile=%o', tile);

		this.add(sprite);
		this.scene.add.existing(sprite);
		this.scene.explosions.add(sprite);
		this.scene.physics.world.enable(sprite);

		if(step<(this.radius-1)) {
			this.createArm(gx+dx,gy+dy,step+1);
		} else {
			sprite.setFrame(0);
			if(gx>0) sprite.flipX = true;
			if(gy>0) sprite.angle = 270;
		}
	}

}
