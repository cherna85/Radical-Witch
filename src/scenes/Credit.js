class Credit extends Phaser.Scene {
    constructor() {
        super('creditScene');
    }

    create() {
        this.add.text(20, 20, "Rad Witch Credits");
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyBomb)) {
            this.scene.start('menuScene');    
        }
    }

}