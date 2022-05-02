class Credit extends Phaser.Scene {
    constructor() {
        super('creditScene');
    }

    preload(){
        this.load.image('credits', './assets/credits.png');
    }

    create() {
        this.add.text(20, 20, "Rad Witch Credits");
        this.add.tileSprite(0, 0, 960, 540, 'credits').setOrigin(0, 0);
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyBomb)) {
            this.scene.start('menuScene');    
        }
    }

}