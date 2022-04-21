class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
        }

    create() {
        //temp text
        this.add.text(20, 20, "Rad Witch Menu");
        //settinng players cursor
        sceneSelect = 'playScene';
        
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        //set up text can be changed to be images
        this.playbutton = this.add.text(game.config.width/2, game.config.height/2 - 32 , 'Press Z to select',  ).setOrigin(0.5);
        this.playbutton = this.add.text(game.config.width/2, game.config.height/2 , 'Play',  {backgroundColor: '#D5B0ED'}).setOrigin(0.5);
        this.tutbutton = this.add.text(game.config.width/2, game.config.height/2 +32 , 'Tutorial').setOrigin(0.5);
        this.optionsbutton = this.add.text(game.config.width/2, game.config.height/2 +64 , 'Options').setOrigin(0.5);
        this.creditsbutton = this.add.text(game.config.width/2, game.config.height/2 +96 , 'Credit').setOrigin(0.5);
       
    }
    update(){
        if (Phaser.Input.Keyboard.JustDown(keyDown)) {
            if(sceneSelect == 'playScene'){
               this.updateMenu(this.playbutton,this.tutbutton, 'tutorialScene');
            }
            else if(sceneSelect == 'tutorialScene'){
                this.updateMenu(this.tutbutton, this.optionsbutton, 'optionScene');
            }  
            else if(sceneSelect == 'optionScene'){
                this.updateMenu(this.optionsbutton, this.creditsbutton, 'creditScene');
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
            else if(sceneSelect == 'optionScene'){
                this.updateMenu(this.optionsbutton, this.tutbutton, 'tutorialScene');
            }  
            else if(sceneSelect == 'creditScene'){
                this.updateMenu(this.creditsbutton, this.optionsbutton, 'optionScene');
            }  
        }
        if (Phaser.Input.Keyboard.JustDown(keyBomb)) {
            this.scene.start(sceneSelect);    
          }

    }
    updateMenu(current, next, scene){
        current.setBackgroundColor('#000000');
        next.setBackgroundColor('#D5B0ED');
        sceneSelect = scene;
    }
}