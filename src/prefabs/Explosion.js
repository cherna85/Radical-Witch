/*
Projectile created by player. Will be able to collide with enemies and defeat them
*/

class Explosion extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, blastPower = -400) {
        super(scene, x, y, texture, frame)

        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.groupBombs.add(this);
        this.blastPower = blastPower;
        this.setCircle(36)
        this.body.allowGravity = false
        this.body.allowDrag = false
        this.body.allowRotation = false
        this.lifespan = 5
    }
}