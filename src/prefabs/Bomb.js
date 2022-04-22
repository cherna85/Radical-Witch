/*
Projectile created by player. Will be able to collide with enemies and defeat them
- Santiago
*/

class Bomb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCircle(16)
        this.body.allowGravity = false
        this.body.allowDrag = false
        this.body.allowRotation = false
    }


}