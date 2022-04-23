class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, attackPower = -400) {
        super(scene, x, y, texture, frame);
        
        //These have to be first for physics stuff to work
        scene.add.existing(this);
        scene.physics.add.existing(this); //Assigns this sprite a physics body
        //remove gravity
        this.body.allowGravity = false;
        this.points = pointValue;
        this.attackPower = attackPower;
        this.moveSpeed = 2; //Phaser.Math.Between(4,10);
        this.setCircle(20); //Testing collision box resizing/changing
        this.setBodySize(200, 50, this.center)
    
    }
    update(time, delta){
        /* Converts delta from milliseconds to seconds. For me it's easier
        to read, but might not match up with how physics object uses delta.
        Let me know if physics seems weird
        - Santiago */
        delta /= 1000
        //moving left
        this.x -= this.moveSpeed;
        //wrap edges
        if(this.x <= 0 - this.width && this.active == true){
            this.destroyEnemy();
        }
    }
    destroyEnemy(){
        this.destroy();
    }
}
