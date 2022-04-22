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
        this.load.image('witchPH', './assets/rocket.png');
        this.load.image('enemy', './assets/spaceship.png');
    }

    create() {
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        
        let placeholderConfig = {
            fontFamily: 'Courier',
            fonstSize: '28px',
            color: '#F0FF5B',
            align: 'left'
        }
        this.add.text(20, 20, "Radical Witch play scene", placeholderConfig);

        this.plrWtich = new PlayerWitch(this, 100, 100, 'witchPH');

        // Enemy implementation
        //// tweak the range 
        this.enemy01 = new Enemy(this, game.config.width,Phaser.Math.Between(150,game.config.height-80),  'enemy', 0, 30).setOrigin(0,0); 
    }
    

    //Time = time passed since game launch
    //Delta = time since last frame in MS (Whole MS, not fractional seconds)
    update(time, delta) {
        //console.log("Delta: " + delta)
        this.plrWtich.update(time, delta);

        //moves the ship
        if(!this.gameOver){
            this.enemy01.update();
        }
        if(this.checkCollision(this.plrWtich, this.enemy01)){
            this.enemy01.reset();
        }

    }
    checkCollision(witch, enemy){
        //AABB checking
        if(witch.x < enemy.x + enemy.width && 
            witch.x + witch.width > enemy.x &&
            witch.y < enemy.y + enemy.height &&
            witch.height + witch.y > enemy.y){
                return true
            }else {
                return false;
            }
    }
}