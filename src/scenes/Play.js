/* 
The main gameplay scene
- Santiago
*/

class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        //Load assets here
    }

    create() {
        let placeholderConfig = {
            fontFamily: 'Courier',
            fonstSize: '28px',
            color: '#F0FF5B',
            align: 'left'
        }
        this.add.text(50, 50, "Radical Witch play scene", placeholderConfig);
    }
    
    //Time = time passed since game launch
    //Delta = time since last frame in MS
    update(time, delta) {

    }
}