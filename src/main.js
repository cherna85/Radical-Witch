/*
RADICAL WITCH
by Citlali Hernandez, Hunter Hechtl, and Santiago Ponce
Completed 5/1/22

CREATIVE TILT

We did many technically interesting things in our game, so I'll list the most important ones
- Used local storage to keep track of high score accross sessions. This is done in Menu.js's
  create() method
- Use of gravity and a launch upwards when the player is overlapping an explosion: Overlaps checked
  in Play.js under plrBlastJump(). Player is a sprite which uses gravity - overlapping explosion
  calls method blastJump()
- AIM ASSIST: It may be hard to notice, but the witch will automatically aim at ghosts that are close to her!
  The defualt angle is 60 deg downwards, so the easiest way to noitce aim assist is if you throw while right
  in front of an enemy - she'll throw forwards instead.
  You can find this in PlayerWitch inside of the throwBomb() method. It will check the list of enemies and
  adjust the aim to target the closest one, as long as the angle does not cause the witch to throw behind herself.
- INCREASING DIFFICULTY: The speed of enemies and duration of stun (getting hit) will increase the more points 
  the player has. This is mostly done in Play.js's update() method
- SCREEN SHAKE: Figured out how to use Phaser's build-in camera shake function and adjust its intensity and duration
  to make sure it isn't too eye-straining.
For our artstyle we took inspiration from Kiki's delivery service - which gives us a cute backdrop that highly
contrasts from the high-octane nature of our witch protagonist.
*/

let config = {
    type: Phaser.AUTO,
    width: 960, // 16 x 9 aspect ratio. Can be scaled up by 2 for fullscreen or divided by 3 to get a good pixel art size
    height: 540,
    scale: {
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
              gravity: { y: 800 },
              debug: false
        }
    },
    scene: [ Menu, Play, Tutorial, Option, Credit, AskTutorial ]
}
// for selecting menu
let sceneSelect = 'playScene';
let enemyGroup;

let localStorageName = "Radical Witch"
let highscore = 0;
let playedBefore = 0; //0 = false, 1+ = true

let speedLow ,speedHigh;
//reserve keyboard vars
let keyBomb, keyDown, keyLeft, keyRight, keyCancel, keyUp;

let game = new Phaser.Game(config);