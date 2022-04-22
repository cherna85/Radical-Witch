/*
Main player character
- Santiago
*/
class PlayerWitch extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, blastPower = -400, bombSprite, throwCooldown = 1, throwForce = 400) {
        super(scene, x, y, texture, frame);
        
        //These have to be first for physics stuff to work
        scene.add.existing(this);
        scene.physics.add.existing(this); //Assigns this sprite a physics body
        
        this.blastPower = blastPower;
        this.throwCooldown = throwCooldown
        this.throwCooldownTimer = 0
        this.throwForce = throwForce
        this.bombSprite = bombSprite
        this.setCircle(20); //Testing collision box resizing/changing
        this.setBodySize(200, 50, this.center)
    }

    update(time, delta){
        /* Converts delta from milliseconds to seconds. For me it's easier
        to read, but might not match up with how physics object uses delta.
        Let me know if physics seems weird
        - Santiago */
        delta /= 1000
        this.throwCooldownTimer -= delta

        if(Phaser.Input.Keyboard.JustDown(keyBomb)){
            this.throwBomb()
        }
        if(Phaser.Input.Keyboard.JustDown(keyCancel)){
            this.setVelocityY(this.blastPower);
        }
    }

    // Create bomb prefab and set its velocity
    throwBomb(){
        if(this.throwCooldownTimer <= 0){
            this.throwCooldownTimer = this.throwCooldown;

            let bombInstance = new Bomb(this.scene, this.x, this.y, this.bombSprite);
            bombInstance.setVelocity(this.throwForce, this.throwForce);
        }
        else{
            console.log("Cant throw bomb right now");
        }
    }
}