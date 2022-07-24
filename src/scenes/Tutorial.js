/* 
Modified version of the main gameplay scene
- Santiago
*/

class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorialScene');
    }

    preload() {
        //Load assets here
        this.load.image('witchPH', './assets/simpleWitch.png');
        this.load.image('poof', './assets/vfx_poof.png');
        //this.load.image('enemy', './assets/simpleGhost.png');
        this.load.spritesheet('explosion', './assets/vfx_explosion.png', { frameWidth: 150, frameHeight: 180, startFrame: 0, endFrame: 10 });
        this.load.spritesheet('ghostMove', './assets/slimeGhost.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 3 });
        this.load.spritesheet('ghostDie', './assets/slimeDie.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 6 });

        //Load new player assets
        let playerPath = './assets/playerAnims/';
        let playerFrames = { frameWidth: 112, frameHeight: 88, startFrame: 0, endFrame: 0 };
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

        this.load.json('tutorialMessages', './assets/TutorialMessages.json');
    }

    create() {
        // create background
        this.backgroundSky = this.add.tileSprite(0, 0, 960, 540, 'backgroundSky').setOrigin(0, 0);
        this.bgMoon = this.add.tileSprite(0, 0, 960, 540, 'moon').setOrigin(0, 0);
        this.bgCity = this.add.tileSprite(0, 0, 960, 540, 'city').setOrigin(0, 0);
        this.bgCritters = this.add.tileSprite(0, 0, 960, 540, 'critters').setOrigin(0, 0);
        this.bgTrees = this.add.tileSprite(0, 0, 960, 540, 'trees').setOrigin(0, 0);
        this.bgPath = this.add.tileSprite(0, 0, 960, 540, 'path').setOrigin(0, 0);
        this.bgPathScroll = 6;

        //particles
        let particles = this.add.particles('poof');
        this.emitter = particles.createEmitter();

        //Explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 10, first: 0 }),
            frameRate: 10
        });

        // Buttons
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyCancel = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        // animation config
        this.anims.create({
            key: 'ghostDie',
            frames: this.anims.generateFrameNumbers('ghostDie', { start: 0, end: 6, first: 0 }),
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
        this.floor = new Floor(this, 480, game.config.height - 20);

        this.plrSpawnX = 100;
        this.plrSpawnY = 100;
        this.plrWitch = new PlayerWitch(this, this.plrSpawnX, this.plrSpawnY, 'witchFlying', 0, 'bomb', 'explosion');
        this.rushBarrier = new RushBarrier(this, this.plrSpawnX, this.plrSpawnY, 'vfxBarrier', 0, this.plrWitch);
        //reset gameover setting zzx
        this.gameOver = false;

        // Physics groups & collisions - Santiago
        this.groupEnemies = this.physics.add.group();
        this.groupEnemies.defaults = {}; //Prevents group from chainging properies (such as gravity) of added objects
        this.groupEnemies.runChildUpdate = true;

        //creating bottom level spawners 
        this.groupEnemieslow = this.physics.add.group();
        this.groupEnemieslow.defaults = {}; //Prevents group from chainging properies (such as gravity) of added objects
        this.groupEnemieslow.runChildUpdate = true;

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
        this.physics.add.collider(this.plrWitch, this.floor);
        this.physics.add.overlap(this.plrWitch, this.floor, this.gameEnd, null, this); //bomb poofs when colliding with floor 
        // UI
        let PlayConfig = {
            fontFamily: 'PressStart2P',
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
        this.score = this.add.text(20, 20, this.p1Score, PlayConfig);
        this.endscreen = 0;
        // stunned effect 
        this.stunEffect = false;
        //hides text off screen
        // text follows the player when needed
        this.stunText = this.add.text(game.config.width + 400, 0, "Stunned", PlayConfig);
        PlayConfig.fontSize = '32px';
        this.OutofBoundsText = this.add.text(game.config.width + 400, 0, "^^^^", PlayConfig);
        this.speedUpdate = false;

        /*Load JSON file for TUTORIAL*/
        this.tutorialMsgs = this.cache.json.get('tutorialMessages');
        PlayConfig.fontSize = '16px';
        this.tutorialText = this.add.text(game.config.width - 20, 20, "Tutorial", PlayConfig).setOrigin(1.0, 0.0);
        this.tutorialText.text = this.tutorialMsgs[0][0];

        this.tutorialSetup();
    }

    tutorialSetup() {
        this.tutCurrLine = 0;
        keyCancel = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        this.plrWitch.body.allowGravity = false;
        this.plrWitch.body.setVelocityY(0);
        this.plrWitch.canDive = false;
        this.plrWitch.canThrow = false;

        
        /* Objectives for the tutorial 
        1st slot is function for enemy spawning behavior, 2nd slot is whether or not to respawn the player
        3rd slot is # of times an objective must be repeated
        4th and onwards is extra function calls*/
        this.objectives = {
            0: [null, false, 0],
            1: [null, false, 0],
            2: [null, false, 0, this.enableBombs],
            3: [this.ghostSpawnLowRandom, null, 3],
            4: [this.ghostSpawnSingleEasy, true, 0, this.enableGravity],
            5: [null, true, 0, this.enableDive, this.enableBombs, this.enableGravity],
            6: [this.ghostSpawnSingleHard, true, 0],
            7: [null, false, 5]
        }
        this.currObjectiveID = -1;
        this.objevtiveProgress = 0;
        /*Need a spawner even so that we can have ghosts that continuously spawn
        Could have single respawn func be an event that fires once. On respawn, the current # of repeats is set to 0 and the thing is reset so it plays once again.
        Spawner is removed on each new line, so a line that has no spawner...maybe it would be undefined?
        No, the spawner stays defined so we have no way to check it. Plus the # of repeats method does not work for repeated playbacks
        */
        this.ongoingSpawner = this.time.addEvent({});
        this.respawnFunc = null;

        //Objective listeners
        this.plrWitch.on('movLeft', () => {
            if(this.currObjectiveID == 0)
                this.objectiveComplete();
        });
        this.plrWitch.on('movRight', () => {
            if(this.currObjectiveID == 1)
                this.objectiveComplete();
        });
        this.plrWitch.on('throwBomb', () => {
            if(this.currObjectiveID == 2)
                this.objectiveComplete();
        });
        this.groupEnemies.on('enemyDefeated', () => {
            if(this.currObjectiveID == 3 || this.currObjectiveID == 7)
                this.objectiveComplete();
        });
        this.plrWitch.on('blastJump', () => {
            if(this.currObjectiveID == 4 || this.currObjectiveID == 6)
                this.objectiveComplete();
        });
        this.plrWitch.on('dive', () => {
            if(this.currObjectiveID == 5)
                this.objectiveComplete();
        })
    }

    /*Called when the player presses the X button and the current objective is complete*/
    tutorialNextLine() {
        this.tutCurrLine += 1;
        if(this.tutCurrLine >= this.tutorialMsgs.length)
            return; //End of tutorial
        
        let currentLine = this.tutorialMsgs[this.tutCurrLine]
        this.tutorialText.text = currentLine[0];
        this.ongoingSpawner.remove(); //Turn off any active enemy spawners
        this.respawnFunc = null;

        //If there is an objective, advancing must be locked
        if(currentLine.length > 1){
            this.currObjectiveID = currentLine[1];
            let currObjArray = this.objectives[this.currObjectiveID];
            
            if(currObjArray[0] != null) //Activate enemy spawners
                currObjArray[0](this);
                this.respawnFunc = currObjArray[0]
            if(currObjArray[1]){ //Reset player position?
                this.plrWitch.x = this.plrSpawnX;
                this.plrWitch.y = this.plrSpawnY;
            }
            this.objectiveProgress = currObjArray[2];

            //Calls any extra functions attached to the objective
            for(let i = 3; i < currObjArray.length; i++){
                currObjArray[i](this);
            }
        }
    }
    objectiveComplete() {
        if(this.currObjectiveID != -1){
            this.objectiveProgress -= 1;
            if(this.objectiveProgress <= 0){
                this.currObjectiveID = -1;
                //Sounds and visual cues
            }
        }
    }

    ghostSpawnLowRandom(scene) {
        let frequency = 1;
        scene.ongoingSpawner = scene.time.addEvent({ delay: frequency*1000, startAt: 999, callback: () =>{
            // this is the lower set of spawners 
            scene.enemySpawn(scene.groupEnemies, game.config.height/2, game.config.height-125);
        },  loop: true });
    }
    ghostSpawnSingleEasy(scene) {
        scene.enemySpawn(scene.groupEnemies, game.config.height-110, game.config.height-110, 5);
    }
    ghostSpawnSingleHard(scene) {
        scene.enemySpawn(scene.groupEnemies, game.config.height-110, game.config.height-110, 5);
    }
    ghostSpawnRegular(scene) {}
    
    //Time = time passed since game launch
    //Delta = time since last frame in MS (Whole MS, not fractional seconds)
    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(keyCancel) && this.currObjectiveID == -1)
            this.tutorialNextLine();

        if (!this.gameOver) {
            this.plrWitch.update(time, delta);
            this.rushBarrier.update();
            //console.log(this.groupExplosions.getLength())
            //Members are removed from the group when they are destroyed. So wtf?
            //scroll background
            this.bgMoon.tilePositionX += this.bgPathScroll - 5.85; // starts 0.15
            this.bgCity.tilePositionX += this.bgPathScroll - 5.75; // starts 0.25
            this.bgCritters.tilePositionX += this.bgPathScroll - 4; // starts 2
            this.bgTrees.tilePositionX += this.bgPathScroll - 2; //starts as 4
            this.bgPath.tilePositionX += this.bgPathScroll; // starts at 6
        }
        if (this.gameOver) {
            if (Phaser.Input.Keyboard.JustDown(keyDown)) {
                if (sceneSelect == 'playScene') {
                    this.restartbutton.setColor('#FFFFFF');
                    this.restartbutton.setShadowBlur(0);
                    this.MainMenubutton.setColor('#FF994F');
                    this.MainMenubutton.setShadowBlur(10);
                    sceneSelect = 'menuScene';
                }
                else if (sceneSelect == 'menuScene') {
                    this.MainMenubutton.setColor('#FFFFFF');
                    this.MainMenubutton.setShadowBlur(0);
                    this.restartbutton.setColor('#FF994F');
                    this.restartbutton.setShadowBlur(10);
                    sceneSelect = 'playScene';
                }
            }
            if (Phaser.Input.Keyboard.JustDown(keyUp)) {
                if (sceneSelect == 'playScene') {
                    this.restartbutton.setColor('#FFFFFF');
                    this.restartbutton.setShadowBlur(0);
                    this.MainMenubutton.setColor('#FF994F');
                    this.MainMenubutton.setShadowBlur(10);
                    sceneSelect = 'menuScene';
                }
                else if (sceneSelect == 'menuScene') {
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
        /*if(this.p1Score %50 == 0 && this.speedUpdate ){
            speedHigh = (speedHigh <15) ? speedHigh+=1:15;
            //console.log("gotta go faster");
            speedLow = (speedLow <12) ? speedLow+=1:12;
            this.speedUpdate = false;
            this.plrWitch.hMoveSpeed = (this.plrWitch.hMoveSpeed < 300) ? this.plrWitch.hMoveSpeed+=50:300; 
            this.bgPathScroll +=1
        }
        if (this.p1Score %50 != 0 && !this.speedUpdate ){
            this.speedUpdate = true;
        }*/
        //the text will follow player
        if (this.stunEffect && !keyBomb.enabled) {
            this.stunText.x = this.plrWitch.x - 40;
            this.stunText.y = this.plrWitch.y - 55;
            if (!keyLeft.enabled) {
                this.plrWitch.setVelocityX(0);
            }
        }
        // when out of bounds arrows follow players position
        if (this.plrWitch.y < 0) {
            this.OutofBoundsText.x = this.plrWitch.x - 40;
        }
        else {
            this.OutofBoundsText.x = -200;
        }
    }

    /*TUTORIAL: Change this func to a quick respawn rather than game-over*/
    gameEnd() {
        this.plrWitch.x = this.plrSpawnX; //Reset player position
        this.plrWitch.y = this.plrSpawnY;
        
        if(this.respawnFunc != null) //Call the enemy spawn function again
            this.respawnFunc(this);
        this.sound.play('sfx_fail');
    }

    enemySpawn(group, yLow, yHigh, speed = undefined) {
        group.add(new Enemy(this, game.config.width, Phaser.Math.Between(yLow, yHigh), 'enemy', 0, 10, speed));
    }

    bombHitsEnemy(bomb, enemy) {
        //console.log("A bomb hit an enemy!");
        this.enemyDefeated(enemy);
        this.cameras.main.shake(100, 0.02);
        bomb.explode();
    }

    explosionHitsEnemy(explosion, enemy) {
        // adding points to player based on enemies they destroyed
        this.enemyDefeated(enemy);
        this.sound.play('sfx_mist');
        let die = this.add.sprite(enemy.x, enemy.y, 'ghostDie').setOrigin(0, 0);
        die.anims.play('ghostDie');
        die.on('animationcomplete', () => {         //callback after aim completes                
            die.destroy();
        });
    }

    enemyDefeated(enemy){
        this.p1Score += enemy.points;
        this.score.text = this.p1Score;
        enemy.destroy();
        this.groupEnemies.emit('enemyDefeated');
    }

    // When player and explosion touch, send player upwards
    plrBlastJump(player, explosion) {
        //Player can only blast jump again after 0.75 seconds
        if (player.blastJumping < -0.75) {
            //console.log("Player caught in blast!");
            player.blastJump();
        }
    }
    stunned(player, enemy) {
        // Blast boost attack implementation
        // stun implmentation
        if (!this.stunEffect && this.plrWitch.body.velocity.y > 0 && !this.gameOver) {
            //console.log("stunned");
            //PLayer is stunned (loses controls)
            this.stunEffect = true;
            this.plrWitch.stunned = true;
            this.sound.play('sfx_stun');
            player.setTexture('witchStunned', 0);

            //Player is unstunned (regain control)
            //Base stun duration is 0.5 seconds, and increases by 0.05 second for every 10 points
            this.regainControls = this.time.addEvent({
                delay: 750 + this.p1Score * 5, callback: () => {
                    // console.log("Unstunned after " + ((500 + this.p1Score * 10) / 100) + " seconds.");

                    this.stunText.x = game.config.width + 400;

                    this.plrWitch.stunned = false;
                    this.plrWitch.setTexture('witchFlying', 0);
                    this.immunityVisual();
                }
            });
            //Player becomes vulnerable to stuns again, some time after regaining control
            //Current: Have 1.5 seconds of stun immunity (base delay - base delay of regainControls)
            this.stunImmune = this.time.addEvent({
                delay: 2250 + this.p1Score * 5, callback: () => {
                    //console.log("not immune");
                    this.stunEffect = false;
                    this.vis.paused = true;
                    this.invis.paused = false;
                }
            });
            //Knockback
            player.KnockBack();
        }
        else if (this.plrWitch.body.velocity.y < 0 && !this.stunEffect) {
            this.enemyDefeated(enemy);
            this.sound.play('sfx_mist');
            let die = this.add.sprite(enemy.x, enemy.y, 'ghostDie').setOrigin(0, 0);
            die.anims.play('ghostDie');
            die.on('animationcomplete', () => {         //callback after aim completes                
                die.destroy();
            });
        }
    }
    immunityVisual() {
        this.vis = this.time.addEvent({
            delay: 300, callback: () => {
                this.plrWitch.alpha = 0.5;
            }, loop: true
        });
        this.invis = this.time.addEvent({
            delay: 600, callback: () => {
                this.plrWitch.alpha = 1;
            }, loop: true
        });
        this.plrWitch.alpha = 1;
    }
    bombHitsFloor(floor, bomb) {
        this.emitter.setPosition(bomb.x, bomb.y);
        this.emitter.setSpeed(250);
        this.emitter.start(false, 2000, 100, 100);
        bomb.destroy();
        this.stop = this.time.addEvent({
            delay: 100, callback: () => {
                this.emitter.stop();
            }
        });

    }

    //In context *this* is referring to the array, so it doesn't work.
    enableBombs(scene) {
        console.log("This shouldn't be called right away");
        scene.plrWitch.canThrow = true;
    }

    enableDive(scene) {
        console.log("This shouldn't be called right away");
        scene.plrWitch.canDive = true;
    }

    enableGravity(scene) {
        scene.plrWitch.body.allowGravity = true;
    }

    disableGravity(scene) {
        scene.plrWitch.body.allowGravity = false;
    }
}