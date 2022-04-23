/*
Projectile created by player. Will be able to collide with enemies and defeat them
- Santiago
*/

class Bomb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.groupBombs.add(this);

        this.setCircle(16)
        this.body.allowGravity = false
        this.body.allowDrag = false
        this.body.allowRotation = false
        this.lifespan = 5
    }

    //  Lifespan. After x seconds a bomb will be removed from the scene to save memory
    update(time, delta){
        this.lifespan -= (delta/1000)
        if(this.lifespan <= 0){
              this.destroy()
        }
    }

    explode(){
        this.destroy();
    }
}