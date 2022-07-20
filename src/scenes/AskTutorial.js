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
                  color: '#FF994F',
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
            sceneSelect = 'yesTutorial';

            keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
      }
}