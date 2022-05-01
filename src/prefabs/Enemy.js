class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, pointValue = 10, speed) {
        super(scene, x, y, texture, frame);
        
        //These have to be first for physics stuff to work
        scene.add.existing(this);
        scene.physics.add.existing(this); //Assigns this sprite a physics body
        //remove gravity
        this.body.allowGravity = false;
        this.points = pointValue;
        if(speed == undefined){
            this.moveSpeed = Phaser.Math.Between(speedLow,speedHigh);
        }
        else{
            this.moveSpeed = speed;
        }
        //add sprite animation    minor guidence provided by Annika Kennedy(classmate)
        this.anims.create({
            key: 'ghostMove',
            frames: this.anims.generateFrameNumbers('ghostMove', {start: 0, end: 3, 
            first: 0}),
            frameRate: 6,
            repeat: -1
         });
         this.anims.play('ghostMove');

         

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
    // updateSpeed(){
    //     speedLow+=1;
    //     speedHigh+=1;
    // }
}
