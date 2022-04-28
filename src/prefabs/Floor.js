class Floor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, ) {
        super(scene, x, y, texture, frame);
        
        //These have to be first for physics stuff to work
        scene.add.existing(this);
        scene.physics.add.existing(this); //Assigns this sprite a physics body
        //remove gravity
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.setSize(game.config.width, 40);
    }
    update(time, delta){
        /* Converts delta from milliseconds to seconds. For me it's easier
        to read, but might not match up with how physics object uses delta.
        Let me know if physics seems weird
        - Santiago */
        delta /= 1000
    }
}
