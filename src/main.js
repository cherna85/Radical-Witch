let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Play ]
}

//reserve keyboard vars
let keyBomb, keyDown, keyLeft, keyRight, keyCancel;

let game = new Phaser.Game(config);