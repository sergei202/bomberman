import { Explosion } from '../objects/explosion';

export class Bomb extends Phaser.Physics.Arcade.Sprite {
	constructor(params) {
		super(params.scene, params.x, params.y, 'bomb');

		// console.log('bomb: %o', this);
		params.scene.add.existing(this);
		params.scene.physics.world.enable(this);
		params.scene.bombs.add(this);

		this.setOrigin(0.5);

		this.x = this.snapToGrid(this.x);
		this.y = this.snapToGrid(this.y);

		this.anims.play('bomb', true);
		this.on('animationcomplete', this.explode, this);
	}

	explode() {
		// console.log('bomb.explode()\t bomb=%o', this);
		var explosion = new Explosion({scene:this.scene, x:this.x, y:this.y, frame:2});
		this.destroy();
	}

	snapToGrid(n,snapSize=32) {
		n -= 16;
		n /= snapSize;
		n = Math.round(n);
		return n*snapSize + 16;
	}
}
