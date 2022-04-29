class AimAssistCheck extends Phaser.Physics.Arcade.StaticBody {
      constructor(world, gameobject) {
            super(world, gameobject);
            
            this.setSize(108, 108);
            this.setCircle(54);
      }

      update() {
            // Follow the witch at all times.
            this.x = this.gameobject.x;
            this.y = this.gameobject.y;
      }
}