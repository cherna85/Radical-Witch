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
        //load player assets
        this.load.image('witchPH', './assets/simpleWitch.png');
        this.load.image('enemy', './assets/simpleGhost.png');
        this.load.image('bomb', './assets/simpleBomb.png');
        this.load.image('explosion', './assets/simpleExplosion.png');
        //load parrallax assets
        this.load.image('backgroundSky', './assets/backgroundSky.png');
        this.load.image('moon', './assets/backgroundMoon.png');
        this.load.image('city', './assets/backgroundCity.png');
        this.load.image('critters', './assets/backgroundCritters.png');
        this.load.image('trees', './assets/backgroundTrees.png');
        this.load.image('path', './assets/backgroundPath.png');
        
    }

    create() {
        // create background
        this.backgroundSky = this.add.tileSprite(0, 0, 960, 540, 'backgroundSky').setOrigin(0,0);
        this.bgMoon = this.add.tileSprite(0, 0, 960, 540, 'moon').setOrigin(0,0);
        this.bgCity = this.add.tileSprite(0, 0, 960, 540, 'city').setOrigin(0,0);
        this.bgCritters = this.add.tileSprite(0, 0, 960, 540, 'critters').setOrigin(0,0);
        this.bgTrees = this.add.tileSprite(0, 0, 960, 540, 'trees').setOrigin(0,0);
        this.bgPath = this.add.tileSprite(0, 0, 960, 540, 'path').setOrigin(0,0);
        // Buttons
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyCancel = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        // end screen selection zxz
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // initialize score
        this.p1Score = 0;

        this.plrWtich = new PlayerWitch(this, 100, 50, 'witchPH', 0, 'bomb', 'explosion');
        //reset gameover setting zzx
        this.gameOver = false;

        // Physics groups & collisions - Santiago
        this.groupEnemies = this.physics.add.group();
        this.groupEnemies.defaults = {}; //Prevents group from chainging properies (such as gravity) of added objects
        this.groupEnemies.runChildUpdate = true;

        this.groupEnemies.add(new Enemy(this, 700, 330, 'enemy', 0, 10).setOrigin(0,0));
        //creating bottom level spawners 
        this.groupEnemieslow = this.physics.add.group();
        this.groupEnemieslow.defaults = {}; //Prevents group from chainging properies (such as gravity) of added objects
        this.groupEnemieslow.runChildUpdate = true;

        this.groupEnemieslow.add(new Enemy(this,  900, game.config.height-125, 'enemy', 0, 10).setOrigin(0,0));

        //number of seconds it takes to spawn a new enemy
        let frequency = 0.1;
        this.spawn = this.time.addEvent({ delay: frequency*1000, callback: () =>{
            this.enemySpawn(this.groupEnemies, 150, game.config.height-130);
        },  loop: true });

        frequency = 2;
        this.spawnLow = this.time.addEvent({ delay: frequency*1000, callback: () =>{
            // this is the lower set of spawners 
            this.enemySpawn(this.groupEnemieslow,game.config.height-125, game.config.height-35);
        },  loop: true });


        this.groupBombs = this.physics.add.group();
        this.groupBombs.defaults = {};
        this.groupBombs.runChildUpdate = true;
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
        this.physics.add.overlap(this.groupBombs, this.groupEnemieslow, this.bombHitsEnemy, null, this);
        this.physics.add.overlap(this.plrWtich, this.groupExplosions, this.plrBlastJump, null, this);
        //this.physics.add.overlap(this.plrWtich, this.groupEnemies, this.stunned, null, this);
        //this.physics.add.overlap(this.plrWtich, this.groupEnemieslow, this.stunned, null, this);
        this.physics.add.overlap(this.groupExplosions, this.groupEnemies, this.explosionHitsEnemy, null, this);
        this.physics.add.overlap(this.groupExplosions, this.groupEnemieslow, this.explosionHitsEnemy, null, this);

        // UI
        let placeholderConfig = {
            fontFamily: 'Courier',
            fonstSize: '28px',
            color: '#F0FF5B',
            align: 'left'
        }
        this.add.text(20, 20, "Radical Witch play scene", placeholderConfig);
        this.score = this.add.text(40, 40, this.p1Score, placeholderConfig );
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
        //scroll background
        this.bgMoon.tilePositionX += 0.15;
        this.bgCity.tilePositionX += 0.25;
        this.bgCritters.tilePositionX += 2;
        this.bgTrees.tilePositionX += 4;
        this.bgPath.tilePositionX += 6;
        if(this.plrWtich.y > game.config.height){
            this.gameOver = true;
            this.spawn.paused = true;
            this.groupEnemies.runChildUpdate = false;
            this.spawnLow.paused = true;
            this.groupEnemieslow.runChildUpdate = false;
            this.endscreen++;
            //prints text
            if(this.endscreen == 1){
                this.add.text(game.config.width/2, game.config.height/2  , 'GAMEOVER',  {color: '#F0FF5B' }).setOrigin(0.5);
                // add hiscore and save to local storage
                if(highscore < this.p1Score){
                    highscore =  this.p1Score;
                    localStorage.setItem(localStorageName, highscore);
                } 
                this.add.text(game.config.width/2, game.config.height/2 + 32, 'Highscore: ' + highscore, {color: '#F0FF5B'}).setOrigin(0.5);
                this.restartbutton = this.add.text(game.config.width/2, game.config.height/2 +64 , 'Restart',  {color: '#F0FF5B', backgroundColor: '#D5B0ED'}).setOrigin(0.5);
                this.MainMenubutton = this.add.text(game.config.width/2, game.config.height/2 +86 , 'Main Menu' ,{color: '#F0FF5B'}).setOrigin(0.5);
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

    enemySpawn( group, yLow, yHigh){
        group.add(new Enemy(this, game.config.width,Phaser.Math.Between(yLow,yHigh),'enemy',0, 10).setOrigin(0,0));
    }

    bombHitsEnemy(bomb, enemy){
        console.log("A bomb hit an enemy!");
        bomb.explode();
    }

    explosionHitsEnemy(explosion, enemy){
        // adding points to player based on enemies they destroyed
        this.p1Score += enemy.points;
        this.score.text = this.p1Score;
        enemy.destroy();
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
           this.plrWtich.stunned = true;
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
                this.plrWtich.stunned = false;
            } });


            //added stuff decide if we wanna keep this
            player.KnockBack();
            enemy.destroy();
       }
    }
}