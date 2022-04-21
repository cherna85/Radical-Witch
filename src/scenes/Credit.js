class Credit extends Phaser.Scene {
    constructor() {
        super('creditScene');
    }

    create() {
        this.add.text(20, 20, "Rad Witch Credits");
    }
}