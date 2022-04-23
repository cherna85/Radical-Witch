class Explosion extends Phaser.Physics.Arcade.Sprite {
      constructor(scene, x, y, texture, frame, lifespan) {
          super(scene, x, y, texture, frame)
  
          scene.add.existing(this);
          scene.physics.add.existing(this);
          //scene.groupExplosions.add(this); //Will be static group

          //this.body = new Phaser.Physics.Arcade.StaticBody(scene, this)
          this.setCircle(128, -128, -128)
          this.lifespan = lifespan //Duration in seconds
          this.body.allowGravity = false;
          //When animation is added, can switch to calls based on animation frames
      }

      update(time, delta){
            this.lifespan -= (delta/1000)
            if(this.lifespan <= 0){
                  this.destroy()
            }
      }
  }