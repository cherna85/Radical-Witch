/*
Main player character
- Santiago
*/
class PlayerWitch extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, blastPower = -700, bombSprite, throwCooldown = 0.5, throwForce = 450) {
        super(scene, x, y, texture, frame);
        
        //These have to be first for physics stuff to work
        scene.add.existing(this);
        scene.physics.add.existing(this); //Assigns this sprite a physics body
        
        this.blastPower = blastPower;
        this.stunned = false;

        this.throwAngle = Math.PI/3; //Needs to be in radians. Positive = rotate clockwise
        this.throwCooldown = throwCooldown;
        this.throwCooldownTimer = 0;
        this.throwForce = throwForce;
        this.bombSprite = bombSprite;

        this.hMoveSpeed = 100; //Horizontal movement
        this.maxFallSpeed = 100;
        this.fallSpeedDefault = 100;

        this.setSize(44, 44)
        this.setCircle(22); //Testing collision box resizing/changing
        //Circle creation based on top-left of previous collision box. Great...
        //Setting size to radius * 2 gets it centered
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
        if(Phaser.Input.Keyboard.JustDown(keyCancel)){ //Remove later
            this.blastJump()
        }

        // DIVE: Triples (Or whatever) falling speed
        if(keyDown.isDown && !this.stunned){
            this.maxFallSpeed = this.fallSpeedDefault * 3;
        }
        else{
            this.maxFallSpeed = this.fallSpeedDefault;
        }

        //Falling speed limit
        if(this.body.velocity.y > this.maxFallSpeed){
            this.setVelocityY(this.maxFallSpeed);
        }

        if(keyLeft.isDown && this.x > 0 && !this.stunned){
            this.setVelocityX(-this.hMoveSpeed);
        }
        else if(keyRight.isDown && this.x < config.width && !this.stunned){
            this.setVelocityX(this.hMoveSpeed);
        }
        else{
            this.setVelocityX(0);
        }
    }

    // Create bomb prefab and set its velocity
    // Might want to throw at a steeper angle, or factor in the player's falling speed
    throwBomb(){
        if(this.throwCooldownTimer <= 0){
            this.throwCooldownTimer = this.throwCooldown;

            let bombInstance = new Bomb(this.scene, this.x, this.y, this.bombSprite);

            let throwVecX = Math.cos(this.throwAngle) * this.throwForce;
            let throwVecY = Math.sin(this.throwAngle) * this.throwForce;

            bombInstance.setVelocity(throwVecX, throwVecY);
        }
        else{
            console.log("Cant throw bomb right now");
        }
    }

    /*Need blasts upwards to be snappy, but overall falling speed to be slow*/
    blastJump(){
        this.setVelocityY(this.blastPower);
    }
    dive(){
        this.setVelocityY(-this.blastPower);
    }
    KnockBack(){
        this.setVelocityY(this.blastPower/4);
    }
}