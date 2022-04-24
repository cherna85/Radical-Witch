/* 
The main gameplay scene
- Santiago
*/

class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        //Load assets here
        this.load.image('witchPH', './assets/simpleWitch.png');
        this.load.image('enemy', './assets/simpleGhost.png');
        this.load.image('background', './assets/simpleforeground.png');

    }

    create() {
        // Buttons
        this.background = this.add.tileSprite(0,0,960,540, 'background').setOrigin(0,0);
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyCancel = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        // end screen selection zxz
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);


        this.plrWtich = new PlayerWitch(this, 100, 100, 'witchPH',);
        //reset gameover setting zzx
        this.gameOver = false;

        // Physics groups & collisions - Santiago
        this.groupEnemies = this.physics.add.group();
        this.groupEnemies.defaults = {}; //Prevents group from chainging properies (such as gravity) of added objects
        this.groupEnemies.runChildUpdate = true;

        //number of seconds it takes to spawn a new enemy
        let frequency = 1;
        this.spawn = this.time.addEvent({ delay: frequency*1000, callback: () =>{
            this.enemySpawn();
        },  loop: true });


        this.groupBombs = this.physics.add.group();
        this.groupBombs.defaults = {};
        this.groupExplosions = this.physics.add.group();
        this.groupExplosions.runChildUpdate = true;
        this.groupExplosions.defaults = {};
        // Even using this instead of a loop, the double explosion bug still happens

        /* Experiment showed that simply having two explosions in group at once causes problems */
        //this.groupExplosions.add(new Explosion(this, 100, 200, null, 0, 0.2))
        //this.groupExplosions.add(new Explosion(this, 100, 200, null, 0, 0.5))

        /*(Below) - last argument is the context to call the function. Might be possible to call a func inside
        one of the two objects instead - Santiago*/
        this.physics.add.overlap(this.groupBombs, this.groupEnemies, this.bombHitsEnemy, null, this);
        this.physics.add.overlap(this.plrWtich, this.groupExplosions, this.plrBlastJump, null, this);
        this.physics.add.overlap(this.plrWtich, this.groupEnemies, this.stunned, null, this);

        // UI
        let placeholderConfig = {
            fontFamily: 'Courier',
            fonstSize: '28px',
            color: '#F0FF5B',
            align: 'left'
        }
        this.add.text(20, 20, "Radical Witch play scene", placeholderConfig);
        this.endscreen = 0;
        // stunned effect 
        this.stunEffect = false;
        //hides text off screen
        // text is gonna follow the player for now
        this.stunText = this.add.text(game.config.width + 400, 0, "Stunned", placeholderConfig);

    } 
    

    //Time = time passed since game launch
    //Delta = time since last frame in MS (Whole MS, not fractional seconds)
    update(time, delta) {
        if(!this.gameOver){
            this.plrWtich.update(time, delta);
            //console.log(this.groupExplosions.getLength())
            //Members are removed from the group when they are destroyed. So wtf?
        }
        this.background.tilePositionX -=4;
        if(this.plrWtich.y > game.config.height){
            this.gameOver = true;
            this.spawn.paused = true;
            this.groupEnemies.runChildUpdate = false;
            this.endscreen++;
            //prints text
            if(this.endscreen == 1){
                this.add.text(game.config.width/2, game.config.height/2  , 'GAMEOVER',  {color: '#F0FF5B' }).setOrigin(0.5);
                this.restartbutton = this.add.text(game.config.width/2, game.config.height/2 +32 , 'Restart',  {color: '#F0FF5B', backgroundColor: '#D5B0ED'}).setOrigin(0.5);
                this.MainMenubutton = this.add.text(game.config.width/2, game.config.height/2 +64 , 'Main Menu' ,{color: '#F0FF5B'}).setOrigin(0.5);
            }   
        }
        if(this.gameOver){
            if (Phaser.Input.Keyboard.JustDown(keyDown)) {
                if(sceneSelect == 'playScene'){
                    this.restartbutton.setBackgroundColor('#000000');
                    this.MainMenubutton.setBackgroundColor('#D5B0ED');
                    sceneSelect = 'menuScene';
                }
                else if(sceneSelect == 'menuScene'){
                    this.MainMenubutton.setBackgroundColor('#000000');
                    this.restartbutton.setBackgroundColor('#D5B0ED');
                    sceneSelect = 'playScene';
                }  
              }
            if (Phaser.Input.Keyboard.JustDown(keyUp)) {
                if(sceneSelect == 'playScene'){
                    this.restartbutton.setBackgroundColor('#000000');
                    this.MainMenubutton.setBackgroundColor('#D5B0ED');
                    sceneSelect = 'menuScene';
                }
                else if(sceneSelect == 'menuScene'){
                    this.MainMenubutton.setBackgroundColor('#000000');
                    this.restartbutton.setBackgroundColor('#D5B0ED');
                    sceneSelect = 'playScene';
                }  
            }
            if (Phaser.Input.Keyboard.JustDown(keyBomb)) {
                console.log('selecting');
                this.scene.start(sceneSelect);    
            }

        }
        // the text will follow player
        if(this.stunEffect){
             this.stunText.x = this.plrWtich.x -25;
             this.stunText.y = this.plrWtich.y - 25;
        }
    }

    enemySpawn(){
        this.groupEnemies.add(new Enemy(this, game.config.width,Phaser.Math.Between(150,game.config.height-80),  'enemy', 0, 30).setOrigin(0,0));
    }

    bombHitsEnemy(bomb, enemy){
        console.log("A bomb hit an enemy!");

        // Even if unassociated with the bomb, the explosion still causes issues with update
        // Perhaps it is something to do with the fact that there are two of them
        enemy.destroy();
        bomb.explode();
    }

    // When player and explosion touch, send player upwards
    plrBlastJump(player, explosion){
        console.log("Player caught in blast!");
        explosion.disableBody();
        player.blastJump();
    }
    stunned(player,enemy){
       if(!this.stunEffect){
           this.stunEffect = true;
            console.log("stunned");
            keyCancel.enabled = false;
            keyDown.enabled = false;
            keyBomb.enabled = false;
            this.stun = this.time.addEvent({ delay: 1500, callback: () =>{
                console.log("unstunned");
                keyCancel.enabled = true;
                keyDown.enabled = true;
                keyBomb.enabled = true;
                this.stunText.x = game.config.width + 400;
                this.stunEffect = false;

            } });


            //added stuff decide if we wanna keep this
            player.KnockBack();
            enemy.destroy();
       }
    }
}