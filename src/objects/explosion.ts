export class Explosion extends Phaser.Physics.Arcade.Sprite {
	constructor(params) {
		super(params.scene, params.x, params.y, 'explosion');


		console.log('bomb: %o', this);
		params.scene.add.existing(this);
		params.scene.physics.world.enable(this);
		params.scene.bombs.add(this);

		// this.body.immovable = true;

		this.setSize(16,16,true);
		this.setOrigin(0.5);

		this.setFrame(2);
		// this.on('animationcomplete', this.explode, this);
	}

}
