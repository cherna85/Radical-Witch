class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorialScene');
    }

    preload(){
        this.load.image('story', './assets/story.png');
        this.load.image('tutorial', './assets/tutorial.png');
    }

    create() {
        this.tutorialImage = this.add.sprite(game.config.width/2, game.config.height/2, 'tutorial').setOrigin(0.5, 0.5);
        this.storyImage = this.add.sprite(game.config.width/2, game.config.height/2, 'story').setOrigin(0.5, 0.5);
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.storySeen = false;
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyBomb)) {
            if(!this.storySeen){
                this.storyImage.setVisible(false);
                this.storySeen = true;
            }
            else{
                this.scene.start('menuScene'); 
            }
        }
    }

}