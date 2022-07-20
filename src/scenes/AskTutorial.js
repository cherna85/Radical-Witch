class AskTutorial extends Phaser.Scene {
      constructor() {
            super("askTutorialScene");
      }

      create() {
            let MenuConfig = {
                  //font from https://fonts.google.com/specimen/Press+Start+2P
                  //https://www.1001fonts.com/sortelo-font.html
                  fontFamily:  'PressStart2P', 
                  fontSize: '16px',
                  backgroundColor: null,
                  color: '#FFFFFF',
                  align: "center",
                  shadow: {
                      offsetX: 0,
                      offsetY: 0,
                      color: '#FEC093',
                      blur: 0,
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
            sceneSelect = 'tutorialScene';

            keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

            this.askText = this.add.text(game.config.width/2, game.config.height/4, "It looks like this is your first time playing,\nWould you like to play the tutorial?", MenuConfig).setOrigin(0.5);

            MenuConfig.shadow.blur =  10;
            MenuConfig.color =  '#FF994F';
            this.yesbutton = this.add.text(game.config.width/2, game.config.height/2 +32 , 'Yes', MenuConfig).setOrigin(0.5);
            MenuConfig.shadow.blur =  0;
            MenuConfig.color =  '#FFFFFF';
            this.nobutton = this.add.text(game.config.width/2, game.config.height/2 +64 , 'No', MenuConfig).setOrigin(0.5);
      }

      update(){
            if (Phaser.Input.Keyboard.JustDown(keyDown) || Phaser.Input.Keyboard.JustDown(keyUp)) {
                  if(sceneSelect == 'tutorialScene'){
                        this.updateMenu(this.yesbutton,this.nobutton, 'playScene');
                  }
                  else{
                        this.updateMenu(this.nobutton, this.yesbutton, 'tutorialScene');
                  }
            }
            if (Phaser.Input.Keyboard.JustDown(keyBomb)) {
                  this.sound.play('sfx_button');
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