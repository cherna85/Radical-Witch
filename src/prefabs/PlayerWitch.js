/*
Main player character
- Santiago
*/

class PlayerWitch extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, blastPower = -400) {
        super(scene, x, y, texture, frame);
        
        //These have to be first for physics stuff to work
        scene.add.existing(this);
        scene.physics.add.existing(this); //Assigns this sprite a physics body
        
        this.blastPower = blastPower;
        this.setCircle(20); //Testing collision box resizing/changing
        this.setBodySize(200, 50, this.center)
    }

    update(time, delta){
        /* Converts delta from milliseconds to seconds. For me it's easier
        to read, but might not match up with how physics object uses delta.
        Let me know if physics seems weird
        - Santiago */
        delta /= 1000

        if(Phaser.Input.Keyboard.JustDown(keyBomb)){
            console.log("Pressed the bomb button");
            this.setVelocityY(this.blastPower);
        }
    }
}