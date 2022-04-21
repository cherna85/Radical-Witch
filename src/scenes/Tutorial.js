class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorialScene');
    }

    create() {
        this.add.text(20, 20, "Rad Witch Tutorial");
    }
}