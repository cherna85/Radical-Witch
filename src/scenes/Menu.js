class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
        }
    preload(){
        // load splash art background
        this.load.image('menuSplash', './assets/witchSplash-1.png');
        //load audio
        this.load.audio('sfx_explosion', './assets/sfx/explosion3.wav');
        this.load.audio('sfx_button', './assets/sfx/explosion3.wav');
        //this.load.audio('sfx_blastUp', './assets/sfx/rocket1.wav');
        this.load.audio('sfx_stun', './assets/sfx/stun2.wav');
        this.load.audio('sfx_fail', './assets/sfx/fail3.wav');
        this.load.audio('sfx_mist', './assets/sfx/owo_ghost1.wav');
        this.load.audio('bg_music', './assets/RadicalWitchMainMenu.wav');
        this.load.audio('sfx_objectiveDone', './assets/sfx/objectiveDone.wav')
    }
    create() {
        this.game.sound.stopAll();
        var radicalMusic = this.sound.add('bg_music', {volume: 0.4}); 
        radicalMusic.setLoop(true);
        radicalMusic.play();
        this.menuSplash = this.add.tileSprite(0, 0, 960, 540, 'menuSplash').setOrigin(0,0);
        //temp text
        let MenuConfig = {
            //font from https://fonts.google.com/specimen/Press+Start+2P
            //https://www.1001fonts.com/sortelo-font.html
            fontFamily:  'Sortelo', 
            fontSize: '112px',
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
        //settinng players cursor
        sceneSelect = 'playScene';
        
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        //set up text can be changed to be images
        this.add.text(game.config.width/2, game.config.height/2 - 98 , 'Radical Witch',MenuConfig ).setOrigin(0.5);
        MenuConfig.fontFamily = 'PressStart2P'
        MenuConfig.color =  '#FFFFFF';
        MenuConfig.fontSize = '20px';
        this.add.text(game.config.width/2, game.config.height/2 - 32 , 'Press Z to select',MenuConfig  ).setOrigin(0.5);
        MenuConfig.fontSize = '16px';
        MenuConfig.color =  '#FF994F';
        this.playbutton = this.add.text(game.config.width/2, game.config.height/2 +32 , 'Play', MenuConfig).setOrigin(0.5);
        MenuConfig.shadow.blur =  0;
        MenuConfig.color =  '#FFFFFF';
        this.tutbutton = this.add.text(game.config.width/2, game.config.height/2 +64 , 'Tutorial', MenuConfig).setOrigin(0.5);
        this.creditsbutton = this.add.text(game.config.width/2, game.config.height/2 +96 , 'Credit', MenuConfig).setOrigin(0.5);

        // get any data of a highscore 
        // this line of code taken from 
        //https://phaserjs.com/saving-high-score
        highscore = parseInt(localStorage.getItem(localStorageName)) || 0;
        playedBefore = parseInt(localStorage.getItem('playedBefore')) || 0;
        //Display Highscore
        this.add.text(150,40, 'Highscore: ' + highscore, MenuConfig ).setOrigin(0.5);
    }
    update(){
        if (Phaser.Input.Keyboard.JustDown(keyDown)) {
            if(sceneSelect == 'playScene'){
               this.updateMenu(this.playbutton,this.tutbutton, 'tutorialScene');
            }
            else if(sceneSelect == 'tutorialScene'){
                this.updateMenu(this.tutbutton, this.creditsbutton, 'creditScene');
            }  
            else if(sceneSelect == 'creditScene'){
                this.updateMenu(this.creditsbutton, this.playbutton, 'playScene');
            }  
          }
        if (Phaser.Input.Keyboard.JustDown(keyUp)) {
            if(sceneSelect == 'playScene'){
               this.updateMenu(this.playbutton,this.creditsbutton, 'creditScene');
            }
            else if(sceneSelect == 'tutorialScene'){
                this.updateMenu(this.tutbutton, this.playbutton, 'playScene');
            }  
            else if(sceneSelect == 'creditScene'){
                this.updateMenu(this.creditsbutton, this.tutbutton, 'tutorialScene');
            }  
        }
        if (Phaser.Input.Keyboard.JustDown(keyBomb)) {
            this.sound.play('sfx_button');

            if(sceneSelect == "playScene" && (true || playedBefore < 1)){
                this.scene.start("askTutorialScene");
                playedBefore = 1;
                localStorage.setItem('playedBefore', playedBefore);
            }
            else
                this.scene.start(sceneSelect);    
          }

    }
    updateMenu(current, next, scene){
        current.setColor('#FFFFFF');
        current.setShadowBlur(0);
        next.setColor('#FF994F');
        next.setShadowBlur(10);
        sceneSelect = scene;
    }
}