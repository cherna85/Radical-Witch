/*
Projectile created by player. Will be able to collide with enemies and defeat them
- Santiago
*/

class Bomb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, blastSprite) {
        super(scene, x, y, texture, frame)
        this.blastSprite = blastSprite

        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.groupBombs.add(this);

        this.setSize(16, 16)
        this.setCircle(8)
        this.body.allowGravity = false
        this.body.allowDrag = false
        this.body.allowRotation = false
        this.lifespan = 5
    }


    update(time, delta){
        this.lifespan -= (delta/1000)
        // Lifespan. After x seconds a bomb will be removed from the scene to save memory
        if(this.lifespan <= 0){
              this.destroy()
        }
    }

    explode(){
        let explosion = new Explosion(this.scene, this.x, this.y, this.blastSprite, 0);
        this.scene.groupExplosions.add(explosion);

        this.destroy();
    }
}