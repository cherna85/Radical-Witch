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
    scene: [ Menu, Play, Tutorial, Option, Credit ]
}
// for selecting menu
let sceneSelect = 'playScene';
let enemyGroup;

//reserve keyboard vars
let keyBomb, keyDown, keyLeft, keyRight, keyCancel, keyUp;

let game = new Phaser.Game(config);