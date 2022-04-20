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
    }
}