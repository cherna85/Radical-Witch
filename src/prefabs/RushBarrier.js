class RushBarrier extends Phaser.Physics.Arcade.Sprite {
      constructor(scene, x, y, texture, frame, playerObj) {
            super(scene, x, y, texture, frame);
            this.playerObj = playerObj;

            scene.add.existing(this);
            scene.physics.add.existing(this);
            this.body.allowGravity = false;
            this.body.allowDrag = false;
            this.body.allowRotation = false;
      }

      update(){
            if(this.playerObj != undefined){
                  this.x = this.playerObj.x - 10;
                  this.y = this.playerObj.y - 10;
            }
            if(this.playerObj.body.velocity.y < 0 && !this.playerObj.stunned){
                  this.alpha = 255;
            }
            else{
                  this.alpha = 0;
            }
      }
}