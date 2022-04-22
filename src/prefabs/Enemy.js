class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y,texture,frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        // eventually we can make move speed a var
        //change it based on difficulty?
        this.moveSpeed = Phaser.Math.Between(4,10);
    }
    update(){
        //moving left
        this.x -= this.moveSpeed;
        //wrap edges
        if(this.x <= 0 - this.width){
            this.reset();
        }
    }
    reset(){
        this.x = game.config.width;
        // changes the postion at every reset
        this.y = Phaser.Math.Between(150,game.config.height- 180);
        //changes speed every reset
        this.moveSpeed = Phaser.Math.Between(1,10);
    }
}
