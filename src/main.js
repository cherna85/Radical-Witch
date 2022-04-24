let config = {
    type: Phaser.AUTO,
    width: 960, // 16 x 9 aspect ratio. Can be scaled up by 2 for fullscreen or divided by 3 to get a good pixel art size
    height: 540,
    physics: {
        default: 'arcade',
        arcade: {
              gravity: { y: 800 },
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