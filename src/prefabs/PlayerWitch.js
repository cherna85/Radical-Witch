/*
Main player character
- Santiago
*/

class PlayerWitch extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, gravityMax, gravityAccel, blastForce) {
        super(scene, x, y, texture, frame);
        
        this.gravityAccel = gravityAccel
        this.gravityMax = gravityMax
        this.blastForce = blastForce

        scene.add.existing(this);
    }

    update(time, delta){
        if(Phaser.Input.Keyboard.JustDown(keyBomb)){
            console.log("Pressed the bomb button");
        }
    }
}