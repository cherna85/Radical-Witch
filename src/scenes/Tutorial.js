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
        this.load.spritesheet('uiCheckmark', './assets/checkmark.png', { frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 1});

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
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keySelect = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
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
            backgroundColor: "#000000",
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
        PlayConfig.wordWrap = {
            width: (game.config.width/3)*2
        }
        PlayConfig.shadow = {};
        this.tutorialText = this.add.text(game.config.width - 20, 20, "Tutorial", PlayConfig).setOrigin(1.0, 0.0);
        this.tutorialText.text = this.tutorialMsgs[0][0];
        this.tutorialText.setDepth(1);

        this.tutorialSetup();
    }

    tutorialSetup() {
        this.tutCurrLine = 0;

        this.plrWitch.body.allowGravity = false;
        this.plrWitch.body.setVelocityY(0);
        this.plrWitch.canDive = false;
        this.plrWitch.canThrow = false;

        
        /* Objectives for the tutorial 
        1st slot is function for enemy spawning behavior, 2nd slot is whether or not to respawn the player
        3rd slot is # of times an objective must be repeated
        4th and onwards is extra function calls*/
        this.objectives = {
            0: [null, false, 1],
            1: [null, false, 1],
            2: [null, false, 1, this.enableBombs],
            3: [this.ghostSpawnLowRandom, null, 3],
            4: [this.ghostSpawnSingleEasy, true, 1, this.enableGravity],
            5: [null, true, 1, this.enableDive, this.enableBombs, this.enableGravity],
            6: [this.ghostSpawnSingleHard, true, 1],
            7: [this.ghostSpawnRegular, true, 5, this.enableDive, this.enableBombs, this.enableGravity],
            8: [null, false, 1, this.tutorialEnd]
        }
        this.currObjectiveID = -1; //If there is an objective currently active or during animation after an objective is complete
        this.objectiveProgress = 0; //If 0 it means the objective is complete - no more progress can be made nor can it be reset
        this.objectiveGoal = 0;
        
        let PlayConfig = {
            fontFamily: 'PressStart2P',
            fontSize: '16px',
            backgroundColor: "#000000",
            color: '#FFFFFF',
            align: "right",
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            }
        }
        this.objectiveText = this.add.text(game.config.width - 20, this.tutorialText.height + 50, "Press [Z] to advance", PlayConfig).setOrigin(1, 0.5);
        this.objectiveText.setColor('#AAAAAA');
        this.objectiveText.setDepth(1);
        this.checkMark = this.add.sprite(game.config.width - 136, this.tutorialText.height + 50, "uiCheckmark", 0).setOrigin(1, 0.5);
        this.checkMark.visible = false;
        this.checkMark.setDepth(1);
        this.objectiveSound = this.sound.add('sfx_objectiveDone', {volume: 0.7});
        
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
                this.objectiveUpdate();
        });
        this.plrWitch.on('movRight', () => {
            if(this.currObjectiveID == 1)
                this.objectiveUpdate();
        });
        this.plrWitch.on('throwBomb', () => {
            if(this.currObjectiveID == 2)
                this.objectiveUpdate();
        });
        this.groupEnemies.on('enemyDefeated', () => {
            if(this.currObjectiveID == 3)
                this.objectiveUpdate();
        });
        this.plrWitch.on('blastJump', () => {
            if(this.currObjectiveID == 4 || this.currObjectiveID == 6 || this.currObjectiveID == 7)
                this.objectiveUpdate();
        });
        this.plrWitch.on('dive', () => {
            if(this.currObjectiveID == 5)
                this.objectiveUpdate();
        })
    }

    /*Called when the player presses the X button and the current objective is complete*/
    tutorialNextLine() {
        this.tutCurrLine += 1;
        if(this.tutCurrLine >= this.tutorialMsgs.length)
            return; //End of tutorial
        
        let currentLine = this.tutorialMsgs[this.tutCurrLine]
        this.tutorialText.text = currentLine[0];
        this.objectiveText.text = "Press [Z] to advance";
        this.objectiveText.setColor('#AAAAAA');
        this.objectiveText.y = this.tutorialText.height + 50;
        this.checkMark.visible = false;
        this.checkMark.y = this.tutorialText.height + 50;

        this.ongoingSpawner.remove(); //Turn off any active enemy spawners
        this.respawnFunc = null;

        this.objectiveProgress = 0; //Reset progress
        this.currObjectiveID = -1;

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

            //Set up objective text
            this.objectiveGoal = currObjArray[2];
            this.objectiveText.text = (this.objectiveGoal - this.objectiveProgress) + " / " + this.objectiveGoal;
            this.objectiveText.setColor('#FFFFFF');
        }
    }
    objectiveUpdate() { //Update objective counter and possible mark as complete
        if(this.objectiveProgress > 0){
            this.objectiveProgress -= 1;

            if(this.objectiveProgress <= 0){
                this.objectiveProgress = 0;

                //Sounds and visual cues
                this.objectiveSound.play();
                this.checkMark.visible = true;
                //Auto-advance line after 1.5 seconds
                this.time.addEvent({delay: 1500, callback: this.tutorialNextLine, callbackScope: this});
            }

            this.objectiveText.text = (this.objectiveGoal - this.objectiveProgress) + " / " + this.objectiveGoal;
        }
    }
    tutorialEnd(mainScene){ //Return to main menu
        //ADD LATER: Mark tutorial as complete
        mainScene.scene.start("menuScene");
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
        scene.enemySpawn(scene.groupEnemies, game.config.height-110, game.config.height-110, 10);
    }
    ghostSpawnRegular(scene) { //Mimics how spawning works in the regular game, but with a slightly lower max spawn height
        if(this.respawnFunc == null) //Prevents this spawner from being activated more than once
        {
            //Should ONLY be activated on the last objective
            let frequency = 1;
            scene.ongoingSpawner = scene.time.addEvent({ delay: frequency*1000, startAt: 999, callback: () =>{
                // this is the lower set of spawners 
                scene.enemySpawn(scene.groupEnemies, 200, game.config.height-145);
            },  loop: true });
            frequency = 2;
            scene.spawnLow = scene.time.addEvent({ delay: frequency*1000, startAt: 999, callback: () =>{
                // this is the lower set of spawners 
                scene.enemySpawn(scene.groupEnemies,game.config.height-125, game.config.height-35);
            },  loop: true });
        }
    }
    
    //Time = time passed since game launch
    //Delta = time since last frame in MS (Whole MS, not fractional seconds)
    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(keyBomb)){
            this.plrWitch.throwBomb();
        }

        if(Phaser.Input.Keyboard.JustDown(keySelect) && this.currObjectiveID == -1){
            this.tutorialNextLine();
        }

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

        if(this.objectiveProgress > 0) //Maybe there should be an 'objective complete' var just so this is easier to understand
            this.sound.play('sfx_fail');        

        if(this.currObjectiveID == 7 && this.objectiveProgress > 0){ //If objective 7 and objective has not already been completed...
            this.objectiveProgress = this.objectiveGoal;
            this.objectiveText.text = (this.objectiveGoal - this.objectiveProgress) + " / " + this.objectiveGoal;
        }
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
            if(this.plrWitch.stunned){ //Cancel stun & stun immunity
                this.plrWitch.stunned = false;
                this.regainControls.elapsed = (this.regainControls.delay - 1);
                this.stunImmune.elapsed = (this.stunImmune.delay - 2);
            }
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
            //Base stun duration is 0.75 seconds, and increases by 0.05 second for every 10 points
            this.regainControls = this.time.addEvent({
                delay: 1000, callback: () => {
                    // console.log("Unstunned after " + ((500 + this.p1Score * 10) / 100) + " seconds.");

                    this.stunText.x = game.config.width + 400;

                    if(this.plrWitch.stunned){
                        this.plrWitch.setTexture('witchFlying', 0);
                    }
                    this.immunityVisual();  //Starts event that makes player's sprite flicker
                    this.plrWitch.stunned = false;
                }
            });
            //Player becomes vulnerable to stuns again, some time after regaining control
            //Current: Have 1.5 seconds of stun immunity (base delay - base delay of regainControls)
            this.stunImmune = this.time.addEvent({
                delay: 2500, callback: () => {
                    //console.log("not immune");
                    this.stunEffect = false;
                    this.plrWitch.alpha= 1;
                    this.vis.remove();
                    this.invis.remove();
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