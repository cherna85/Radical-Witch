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
        keyCancel = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        
        let placeholderConfig = {
            fontFamily: 'Courier',
            fonstSize: '28px',
            color: '#F0FF5B',
            align: 'left'
        }
        this.add.text(20, 20, "Radical Witch play scene", placeholderConfig);

        this.plrWtich = new PlayerWitch(this, 100, 100, 'witchPH');

        // first enemy is spawned 
        this.enemy01 = new Enemy(this, game.config.width,350,  'enemy', 0, 30).setOrigin(0,0);

        
        enemyGroup = this.physics.add.group();
        enemyGroup.defaults = {};
        //number of seconds it takes to spawn a new enemy
        let frequency = 2;
        let spawn = this.time.addEvent({ delay: frequency*1000, callback: () =>{
            this.enemySpawn();
        },  loop: true });


        this.groupBombs = this.physics.add.group();
        this.groupBombs.defaults = {};

        /*(Below) - last argument is the context to call the function. Might be possible to call a func inside
        one of the two objects instead - Santiago*/
        this.physics.add.overlap(this.groupBombs, enemyGroup, this.bombHitsEnemy, null, this);
    }
    

    //Time = time passed since game launch
    //Delta = time since last frame in MS (Whole MS, not fractional seconds)
    update(time, delta) {
        this.plrWtich.update(time, delta);

        //moves the ship
         if(!this.gameOver){
            
            this.enemy01.update();
            enemyGroup.runChildUpdate = true;
        }   
    }

    enemySpawn(){
        enemyGroup.add(new Enemy(this, game.config.width,Phaser.Math.Between(150,game.config.height-80),  'enemy', 0, 30).setOrigin(0,0));
    }

    bombHitsEnemy(bomb, enemy){
        console.log("A bomb hit an enemy!");
        enemy.disableBody(true, true);
        bomb.disableBody(true, true);
        //creates a new explosion object
        this.explosion = new Explosion(this, bomb.x, bomb.y);
        bomb.destroy();
        enemy.destroy();
        this.plrWtich.setVelocityY(this.explosion.blastPower);
        this.explosion.destroy();
        
    }
}