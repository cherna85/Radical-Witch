class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorialScene');
    }

    create() {
        this.add.text(20, 20, "Rad Witch Tutorial");
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyBomb)) {
            this.scene.start('menuScene');    
        }
    }

}