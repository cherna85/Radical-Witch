class Explosion extends Phaser.Physics.Arcade.Sprite {
      constructor(scene, x, y, texture, frame, lifespan = 0.2) {
          super(scene, x, y, texture, frame)
  
          scene.add.existing(this);
          scene.physics.add.existing(this);
          //scene.groupExplosions.add(this); //Will be static group

          //this.body = new Phaser.Physics.Arcade.StaticBody(scene, this)
          this.setSize(96, 96)
          this.setCircle(48)
          this.setOffset(28, 58)
          this.lifespan = lifespan //Duration in seconds
          this.body.allowGravity = false;
          this.move = 0;
          //When animation is added, can switch to calls based on animation frames
          
          // Play explosion animation. On completion, delete object
          this.anims.play('explode');
          this.on('animationComplete', () => {
            this.destroy();
            });
      }

      update(time, delta){
            this.lifespan -= (delta/1000);
            this.x -= this.move;
            if(this.lifespan <= 0){
                  //Disables further overlap interactions after [lifespan] seconds
                  this.body.setEnable(false);
            }
      }
  }