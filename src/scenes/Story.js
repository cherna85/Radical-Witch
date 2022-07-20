class Story extends Phaser.Scene {
    constructor() {
        super('storyScene');
    }

    preload(){
        this.load.image('story', './assets/story.png');
    }

    create() {
        this.storyImage = this.add.sprite(game.config.width/2, game.config.height/2, 'story').setOrigin(0.5, 0.5);
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyBomb)) {
            this.scene.start('menuScene'); 
        }
    }

}