/*
Main player character
- Santiago


Placeholder sprite is 56 x 56
New sprite is 50 x 44, with it being 3 pixels to left so that the 6 pixels are outside the 44 circle
*/
class PlayerWitch extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, bombSprite, blastSprite, blastPower = -700, throwCooldown = 0.5, throwForce = 450) {
        super(scene, x, y, texture, frame);
        
        //These have to be first for physics stuff to work
        scene.add.existing(this);
        scene.physics.add.existing(this); //Assigns this sprite a physics body
        
        this.blastPower = blastPower;
        this.blastJumping = 0;
        this.stunned = false;

        this.throwAngle = Math.PI/3; //Needs to be in radians. Positive = rotate clockwise
        this.throwCooldown = throwCooldown;
        this.throwCooldownTimer = 0;
        this.throwForce = throwForce;
        this.aimAssistRng = 135; //Distance threshold to trigger aim assist in pixels
        this.minAim = -0.175; //In Radians
        this.maxAim = 1.92;

        this.bombSprite = bombSprite;
        this.blastSprite = blastSprite;

        this.hMoveSpeed = 100; //Horizontal movement
        this.maxFallSpeed = 100;
        this.fallSpeedDefault = 100;
        this.setDrag(0);

        
        this.setSize(44, 44); // Creates a new box at the sprite's center.
        //Ok, so setSize creates a new box at the sprite's cetner with the box's center being its origin.
        //But setOffset changes the box's center being it's top-left, and moves it according to top-left of sprite
        //Wtf
        this.setOffset(34, 28);
        this.setCircle(22); //Testing collision box resizing/changing
        
        //Circle creation based on top-left of previous collision box. Great...
        //Setting size to radius * 2 gets it centered

        //TUTORIAL SETTINGS
        this.canDive = true;
        this.canThrow = true;
    }

    update(time, delta){
        /* Converts delta from milliseconds to seconds. For me it's easier
        to read, but might not match up with how physics object uses delta.
        Let me know if physics seems weird
        - Santiago */
        delta /= 1000
        this.throwCooldownTimer -= delta;
        this.blastJumping -= delta;
        
        if(this.canThrow && Phaser.Input.Keyboard.JustDown(keyBomb) && !this.stunned){
            this.throwBomb()
        }

        // DIVE: Triples (Or whatever) falling speed
        if(this.canDive && keyDown.isDown && !this.stunned){
            this.maxFallSpeed = this.fallSpeedDefault * 3;
            this.emit('dive');
        }
        else{
            this.maxFallSpeed = this.fallSpeedDefault;
        }

        //Falling speed limit
        if(this.body.velocity.y > this.maxFallSpeed){
            this.setVelocityY(this.maxFallSpeed);
        }

        //Horizontal movement
        if(keyLeft.isDown && this.x > 0 && !this.stunned){
            this.setVelocityX(-this.hMoveSpeed * 1.2); //Going backwards is slightly faster
            this.emit('movLeft');
        }
        else if(keyRight.isDown && this.x < config.width && !this.stunned){
            this.setVelocityX(this.hMoveSpeed);
            this.emit('movRight');
        }
        else{
            this.setVelocityX(0);
        }


        /* Animation state junk - Santiago */
        if(!this.stunned){
            if(this.body.velocity.y >= 0 && this.throwCooldownTimer <= 0){
                if(this.canDive && keyDown.isDown){
                    this.setTexture('witchDive');
                }
                else{
                    this.setTexture('witchFlying');
                }
            }
        }
    }

    // Create bomb prefab and set its velocity
    // Might want to throw at a steeper angle, or factor in the player's falling speed
    throwBomb(){
        if(this.throwCooldownTimer <= 0){

            let enemyList = this.scene.groupEnemies.children.getArray();
            //Adding (17, 14) to position to account for hitbox offset - Santiago
            let selfPos = new Phaser.Math.Vector2(this.x + 17, this.y + 14);
            let targetPos = new Phaser.Math.Vector2(0, 0);
            let targetDist = Infinity;
            for(let enemy of enemyList){
                let enemyPos = new Phaser.Math.Vector2(enemy.x, enemy.y);
                let distance = selfPos.distance(enemyPos);
                if(distance < Infinity && distance < this.aimAssistRng){
                    targetDist = distance;
                    targetPos = enemyPos;
                }
            }
            //It works, I just made the detection range too short (Should be around 54 or higher)

            /* Alternate method (Or rather, more like an optional expansion)
                On overlap, add enemies to a list in player class (must be enemy class)
                When throw is called, will look through this list for closest target
                Witch will target pos of whichever enemy is closest
                To prevent enemies from persisting in list, the list is cleared at end of player update
                (Player update called after overlap funcs - throw button check must come first)
            */

            this.throwCooldownTimer = this.throwCooldown;

            let bombInstance = new Bomb(this.scene, this.x, this.y, this.bombSprite, 0, this.blastSprite);

            let throwVecX = Math.cos(this.throwAngle) * this.throwForce;
            let throwVecY = Math.sin(this.throwAngle) * this.throwForce;
            if(targetDist != Infinity){ //Within aim-assist range.
                //(Below) Create vector towards enemy position
                let aimAssistVec = ((targetPos.subtract(selfPos)).normalize()).setLength(this.throwForce * 1.5);
                let assistAngle = aimAssistVec.angle(); //Angle from x-axis in radians
                
                //Use normal throw if angle is not within range.
                //If want to simply clamp value instead, use clamp() function
                if(assistAngle > this.maxAim || assistAngle < this.minAim){
                    assistAngle = this.throwAngle;
                    aimAssistVec.setLength(this.throwForce);
                }

                aimAssistVec.setAngle(assistAngle);

                throwVecX = aimAssistVec.x;
                throwVecY = aimAssistVec.y;
                //console.log(aimAssistVec.x + ", " + aimAssistVec.y);
            }

            bombInstance.setVelocity(throwVecX, throwVecY);
            this.setTexture('witchThrow', 0);

            this.emit('throwBomb');
        }
        else{
           // console.log("Cant throw bomb right now");
        }
    }

    /*Need blasts upwards to be snappy, but overall falling speed to be slow*/
    blastJump(){
        this.setVelocityY(this.blastPower);
        this.setTexture('witchAscend');
        this.blastJumping = 0;
        this.emit('blastJump');
    }
    dive(){
        this.setVelocityY(-this.blastPower);
    }
    KnockBack(){
        this.setVelocityY(this.blastPower/4);
    }
    //prevents players from sliding when game ends
    //or stunned
    faceplantSlide(endscreen, groundScrollSpeed){
        if(endscreen == 1){
            //console.log("Player faceplanted")

            //By using groundScrollSpeed, this should hopefully scale with how 'fast' the player is moving
            this.setVelocityX(groundScrollSpeed * 60);
            this.setDragX(300);
        }
    }

    clamp(number, max, min){
        return Math.min(Math.max(number, min), max);
    }
}