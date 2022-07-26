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
        this.load.image('poof', './assets/vfx_poof.png');
        //this.load.image('enemy', './assets/simpleGhost.png');
        this.load.spritesheet('explosion', './assets/vfx_explosion.png', {frameWidth: 150, frameHeight: 180, startFrame: 0, endFrame: 10});
        this.load.spritesheet('ghostMove', './assets/slimeGhost.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 3});
        this.load.spritesheet('ghostDie', './assets/slimeDie.png', {frameWidth: 64, frameHeight: 32, startFrame:0, endFrame: 6});

        //Load new player assets
        let playerPath = './assets/playerAnims/';
        let playerFrames = {frameWidth: 112, frameHeight: 88, startFrame: 0, endFrame: 0};
        //Currently not animated, but loading as spritesheets removes some work later
        this.load.spritesheet('witchFlying', playerPath + 'witchPC_flying.png', playerFrames);
        this.load.spritesheet('witchThrow', playerPath + 'witchPC_throw.png', playerFrames);
        this.load.spritesheet('witchDive', playerPath + 'witchPC_dive.png', playerFrames);
        this.load.spritesheet('witchAscend', playerPath + 'witchPC_ascend.png', playerFrames);
        this.load.spritesheet('witchStunned', playerPath + 'witchPC_stunned.png', playerFrames);
        this.load.spritesheet('witchFaceplant', playerPath + 'witchPC_faceplant.png', playerFrames);

        this.load.spritesheet('vfxBarrier', playerPath + 'vfx_rush_barrier.png', playerFrames);
        this.load.spritesheet('bomb', playerPath + 'bomb_big.png', playerFrames);

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
        this.bgPathScroll = 6;

        //particles
        let particles = this.add.particles('poof');
        this.emitter = particles.createEmitter();



        //Explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 10, first: 0}),
            frameRate: 10
        });

        // Buttons
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyCancel = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        // animation config
         this.anims.create({
            key: 'ghostDie',
            frames: this.anims.generateFrameNumbers('ghostDie', {start: 0, end: 6, first: 0}),
         })
        // end screen selection zxz
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // initialize score and speeds
        this.p1Score = 0;
        speedLow = 4;
        speedHigh = 7;
        // creates a floor to collide with 
        this.floor = new Floor(this,480,game.config.height-20);

        this.plrWitch = new PlayerWitch(this, 100, 50, 'witchFlying', 0, 'bomb', 'explosion');
        this.rushBarrier = new RushBarrier(this, 100, 50, 'vfxBarrier', 0, this.plrWitch);
        //reset gameover setting zzx
        this.gameOver = false;

        // Physics groups & collisions - Santiago
        this.groupEnemies = this.physics.add.group();
        this.groupEnemies.defaults = {}; //Prevents group from chainging properies (such as gravity) of added objects
        this.groupEnemies.runChildUpdate = true;

        this.groupEnemies.add(new Enemy(this, 700, 330, 'enemy', 0, 10));
        //creating bottom level spawners 
        this.groupEnemieslow = this.physics.add.group();
        this.groupEnemieslow.defaults = {}; //Prevents group from chainging properies (such as gravity) of added objects
        this.groupEnemieslow.runChildUpdate = true;

        this.groupEnemies.add(new Enemy(this,  900, game.config.height-125, 'enemy', 0, 10));

        //number of seconds it takes to spawn a new enemy
        let frequency = 1.0;
        this.spawn = this.time.addEvent({ delay: frequency*1000, callback: () =>{
            this.enemySpawn(this.groupEnemies, 150, game.config.height-145);
        },  loop: true });

        frequency = 2;
        this.spawnLow = this.time.addEvent({ delay: frequency*1000, callback: () =>{
            // this is the lower set of spawners 
            this.enemySpawn(this.groupEnemies,game.config.height-125, game.config.height-35);
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
        this.physics.add.overlap(this.plrWitch, this.groupExplosions, this.plrBlastJump, null, this);
        this.physics.add.overlap(this.plrWitch, this.groupEnemies, this.stunned, null, this);
        this.physics.add.overlap(this.plrWitch, this.groupEnemieslow, this.stunned, null, this);
        this.physics.add.overlap(this.groupExplosions, this.groupEnemies, this.explosionHitsEnemy, null, this);
        this.physics.add.overlap(this.groupExplosions, this.groupEnemieslow, this.explosionHitsEnemy, null, this);

        this.physics.add.overlap(this.groupBombs, this.floor, this.bombHitsFloor, null, this);
        //makes the floor a solid object and then ends game when player collides with it
        this.physics.add.collider(this.plrWitch,this.floor);
        this.physics.add.overlap(this.plrWitch, this.floor, this.gameEnd, null, this); //bomb poofs when colliding with floor 
        // UI
        let PlayConfig = {
            fontFamily:  'PressStart2P', 
            fontSize: '16px',
            backgroundColor: null,
            color: '#FFFFFF',
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#FEC093',
                blur: 10,
                stroke: true,
                fill: true
            }, padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
        }
        this.score = this.add.text(20, 20, this.p1Score, PlayConfig );
        this.endscreen = 0;
        // stunned effect 
        this.stunEffect = false;
        //hides text off screen
        // text follows the player when needed
        this.stunText = this.add.text(game.config.width + 400, 0, "Stunned", PlayConfig);
        PlayConfig.fontSize = '32px';
        this.OutofBoundsText = this.add.text(game.config.width + 400, 0, "^^^^",  PlayConfig);
        this.speedUpdate = false;
    } 
    

    //Time = time passed since game launch
    //Delta = time since last frame in MS (Whole MS, not fractional seconds)
    update(time, delta) {
        delta /= 1000;

        if(!this.gameOver){
            this.plrWitch.update(time, delta * 1000);
            this.rushBarrier.update();
            //console.log(this.groupExplosions.getLength())
            //Members are removed from the group when they are destroyed. So wtf?
            //scroll background
            delta *= 60;
            this.bgMoon.tilePositionX += (this.bgPathScroll - 5.85) * delta; // starts 0.15
            this.bgCity.tilePositionX += (this.bgPathScroll - 5.75) * delta; // starts 0.25
            this.bgCritters.tilePositionX += (this.bgPathScroll - 4) * delta; // starts 2
            this.bgTrees.tilePositionX += (this.bgPathScroll - 2) * delta; //starts as 4
            this.bgPath.tilePositionX += (this.bgPathScroll) * delta; // starts at 6
        }
        if(this.gameOver){
            if (Phaser.Input.Keyboard.JustDown(keyDown)) {
                if(sceneSelect == 'playScene'){
                    this.restartbutton.setColor('#FFFFFF');
                    this.restartbutton.setShadowBlur(0);
                    this.MainMenubutton.setColor('#FF994F');
                    this.MainMenubutton.setShadowBlur(10);
                    sceneSelect = 'menuScene';
                }
                else if(sceneSelect == 'menuScene'){
                    this.MainMenubutton.setColor('#FFFFFF');
                    this.MainMenubutton.setShadowBlur(0);
                    this.restartbutton.setColor('#FF994F');
                    this.restartbutton.setShadowBlur(10);
                    sceneSelect = 'playScene';
                }  
              }
            if (Phaser.Input.Keyboard.JustDown(keyUp)) {
                if(sceneSelect == 'playScene'){
                    this.restartbutton.setColor('#FFFFFF');
                    this.restartbutton.setShadowBlur(0);
                    this.MainMenubutton.setColor('#FF994F');
                    this.MainMenubutton.setShadowBlur(10);
                    sceneSelect = 'menuScene';
                }
                else if(sceneSelect == 'menuScene'){
                    this.MainMenubutton.setColor('#FFFFFF');
                    this.MainMenubutton.setShadowBlur(0);
                    this.restartbutton.setColor('#FF994F');
                    this.restartbutton.setShadowBlur(10);
                    sceneSelect = 'playScene';
                }  
            }
            if (Phaser.Input.Keyboard.JustDown(keyBomb)) {
                //console.log('selecting');
                this.scene.start(sceneSelect);    
            }
        }
        // implements speedup
        if(this.p1Score %50 == 0 && this.speedUpdate ){
            speedHigh = (speedHigh <15) ? speedHigh+=1:15;
            //console.log("gotta go faster");
            speedLow = (speedLow <12) ? speedLow+=1:12;
            this.speedUpdate = false;
            this.plrWitch.hMoveSpeed = (this.plrWitch.hMoveSpeed < 300) ? this.plrWitch.hMoveSpeed+=50:300; 
            this.bgPathScroll +=1
        }
        if (this.p1Score %50 != 0 && !this.speedUpdate ){
            this.speedUpdate = true;
        }
        //the text will follow player
        if(this.stunEffect && !keyBomb.enabled ){
             this.stunText.x = this.plrWitch.x -40;
             this.stunText.y = this.plrWitch.y - 55;
            if(!keyLeft.enabled){
                this.plrWitch.setVelocityX(0);
            }
        }
        // when out of bounds arrows follow players position
        if(this.plrWitch.y <0){
            this.OutofBoundsText.x = this.plrWitch.x -40;
        }
        else{
            this.OutofBoundsText.x = -200;
        }
    }

    gameEnd(){
            this.gameOver = true;
            this.spawn.paused = true;
            this.groupEnemies.runChildUpdate = false;
            this.spawnLow.paused = true;
            this.groupEnemieslow.runChildUpdate = false;
            this.endscreen++; // prevents endscreen from generating multiple times
            let PlayConfig = {
                fontFamily:  'Sortelo', 
                fontSize: '96px',
                backgroundColor: null,
                color: '#FF994F',
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#FEC093',
                    blur: 10,
                    stroke: true,
                    fill: true
                }, padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                },
            }

            this.plrWitch.faceplantSlide(this.endscreen, this.bgPathScroll);
            this.plrWitch.setTexture('witchFaceplant');

            //prints text
            if(this.endscreen == 1){
                // camera shake on floor
                this.cameras.main.shake( 200,0.02);
                this.add.text(game.config.width/2, game.config.height/2 -32 , 'GAMEOVER',  PlayConfig).setOrigin(0.5);
                // add highscore and save to local storage
                PlayConfig.fontFamily = "PressStart2P"
                if(highscore < this.p1Score){
                    highscore =  this.p1Score;
                    localStorage.setItem(localStorageName, highscore);
                }
                 PlayConfig.fontSize = '16px';
                this.restartbutton = this.add.text(game.config.width/2, game.config.height/2 +64 , 'Restart', PlayConfig).setOrigin(0.5);
                PlayConfig.color =  '#FFFFFF';
                this.add.text(game.config.width/2, game.config.height/2 + 32, 'Highscore: ' + highscore, PlayConfig).setOrigin(0.5);
                PlayConfig.shadow.blur = 0;
                this.MainMenubutton = this.add.text(game.config.width/2, game.config.height/2 +98 , 'Main Menu' ,PlayConfig).setOrigin(0.5);
                this.sound.play('sfx_fail');
                //radicalMusic.pause();
            }   
    }
    enemySpawn( group, yLow, yHigh){
        group.add(new Enemy(this, game.config.width,Phaser.Math.Between(yLow,yHigh),'enemy',0, 10));
    }

    bombHitsEnemy(bomb, enemy){
        //console.log("A bomb hit an enemy!");
        this.p1Score += enemy.points;
        this.score.text = this.p1Score;
        enemy.destroy();
        this.cameras.main.shake( 100,0.02);
        bomb.explode();
    }

    explosionHitsEnemy(explosion, enemy){
        // adding points to player based on enemies they destroyed
        this.p1Score += enemy.points;
        this.score.text = this.p1Score;
        enemy.destroy();
        this.sound.play('sfx_mist');
        let die = this.add.sprite(enemy.x, enemy.y, 'ghostDie').setOrigin(0,0);
        die.anims.play('ghostDie');
        die.on('animationcomplete', () => {         //callback after aim completes                
            die.destroy();
        });
        console.log("Explosion hit enemy");
    }

    // When player and explosion touch, send player upwards
    plrBlastJump(player, explosion){
        //Player can only blast jump again after 0.75 seconds
        if(player.blastJumping < -0.75){
            //console.log("Player caught in blast!");
            player.blastJump();
        }
    }
    stunned(player,enemy){
        // Blast boost attack implementation
        // stun implmentation
       if(!this.stunEffect && this.plrWitch.body.velocity.y > 0 && !this.gameOver){
            //console.log("stunned");
            //PLayer is stunned (loses controls)
            this.stunEffect = true;
            this.plrWitch.stunned = true;
            this.sound.play('sfx_stun');
            player.setTexture('witchStunned', 0);

            //Player is unstunned (regain control)
            //Base stun duration is 0.5 seconds, and increases by 0.05 second for every 10 points
            this.regainControls = this.time.addEvent({ delay: 750 + this.p1Score * 5, callback: () =>{
               // console.log("Unstunned after " + ((500 + this.p1Score * 10) / 100) + " seconds.");

                this.stunText.x = game.config.width + 400;

                this.plrWitch.stunned = false;
                this.plrWitch.setTexture('witchFlying', 0);
                this.immunityVisual();
            } });
            //Player becomes vulnerable to stuns again, some time after regaining control
            //Current: Have 1.5 seconds of stun immunity (base delay - base delay of regainControls)
            this.stunImmune = this.time.addEvent({ delay: 2250 + this.p1Score * 5, callback: () =>{
                //console.log("not immune");
                this.stunEffect = false;
                this.vis.paused = true;
                this.invis.paused = false;
            } });
            //Knockback
            player.KnockBack();
      }
       else if(this.plrWitch.body.velocity.y < 0 && !this.stunEffect){
            enemy.destroy();
            this.sound.play('sfx_mist');
            let die = this.add.sprite(enemy.x, enemy.y, 'ghostDie').setOrigin(0,0);
            die.anims.play('ghostDie');
            die.on('animationcomplete', () => {         //callback after aim completes                
                die.destroy();
            });
            this.p1Score += enemy.points;
            this.score.text = this.p1Score;
       }
    }
    immunityVisual(){
        this.vis = this.time.addEvent({delay: 300, callback: () =>{
            this.plrWitch.alpha= 0.5;
        }, loop: true });
        this.invis = this.time.addEvent({delay: 600, callback: () =>{
            this.plrWitch.alpha= 1;
        }, loop: true });
        this.plrWitch.alpha= 1;
    }
    bombHitsFloor(floor, bomb){
        this.emitter.setPosition(bomb.x, bomb.y);
        this.emitter.setSpeed(250);
        this.emitter.start(false, 2000, 100, 100);
            bomb.destroy();
            this.stop = this.time.addEvent({ delay: 100 , callback: () =>{
                  this.emitter.stop();
             } });
           
    }
}