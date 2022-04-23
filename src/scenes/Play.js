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
        enemyGroup = this.add.group();
        //number of seconds it takes to spawn a new enemy
        let frequency = 1;
        let spawn = this.time.addEvent({ delay: frequency*1000, callback: () =>{
            this.enemySpawn();
        },  loop: true });
    }
    

    //Time = time passed since game launch
    //Delta = time since last frame in MS (Whole MS, not fractional seconds)
    update(time, delta) {
        //console.log("Delta: " + delta)
        this.plrWtich.update(time, delta);

        //moves the ship
         if(!this.gameOver){
            enemyGroup.runChildUpdate = true;
        //this.enemySpawn(3);
        }   
    }
    enemySpawn(){
        enemyGroup.add(new Enemy(this, game.config.width,Phaser.Math.Between(150,game.config.height-80),  'enemy', 0, 30).setOrigin(0,0));
    }
}