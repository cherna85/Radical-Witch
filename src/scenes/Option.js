class Option extends Phaser.Scene {
    constructor() {
        super('optionScene');
    }

    create() {
        this.add.text(20, 20, "Rad Witch Options");
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyBomb)) {
            this.scene.start('menuScene');    
        }
    }

}