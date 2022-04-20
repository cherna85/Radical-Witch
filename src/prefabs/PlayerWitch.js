/*
Main player character
- Santiago
*/

class PlayerWitch extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, gravityAccel = 25, gravityMax = 50, blastForce = -100) {
        super(scene, x, y, texture, frame);
        
        this.gravityAccel = gravityAccel
        this.gravityMax = gravityMax
        this.blastForce = blastForce
        this.verticalVel = 0

        scene.add.existing(this);
    }

    update(time, delta){
        delta /= 1000; //Convert delta from MS to S

        this.verticalVel += this.gravityAccel * delta;
        if(this.verticalVel > this.gravityMax){
            this.verticalVel = this.gravityMax;
        }

        if(Phaser.Input.Keyboard.JustDown(keyBomb)){
            console.log("Pressed the bomb button");
            this.verticalVel = this.blastForce;
        }
        
        this.y += this.verticalVel * delta;
        //If I add verticalVel * delta, that should change grav to pixels per sec, right?
    }
}