let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
              gravity: { y: 300 },
              debug: true
        }
  },
    scene: [ Play ]
}

//reserve keyboard vars
let keyBomb, keyDown, keyLeft, keyRight, keyCancel;

let game = new Phaser.Game(config);