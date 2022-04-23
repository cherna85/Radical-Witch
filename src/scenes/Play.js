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
        // Buttons
        keyBomb = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyCancel = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        this.plrWtich = new PlayerWitch(this, 100, 100, 'witchPH');

        // Physics groups & collisions - Santiago
        this.groupEnemies = this.physics.add.group();
        this.groupEnemies.defaults = {}; //Prevents group from chainging properies (such as gravity) of added objects
        this.groupEnemies.runChildUpdate = true;

        //number of seconds it takes to spawn a new enemy
        let frequency = 1;
        let spawn = this.time.addEvent({ delay: frequency*1000, callback: () =>{
            this.enemySpawn();
        },  loop: true });


        this.groupBombs = this.physics.add.group();
        this.groupBombs.defaults = {};
        this.groupExplosions = this.physics.add.group();
        this.groupExplosions.runChildUpdate = true;
        this.groupExplosions.defaults = {};
        // Even using this instead of a loop, the double explosion bug still happens

        /* Experiment showed that simply having two explosions in group at once causes problems */
        //this.groupExplosions.add(new Explosion(this, 100, 200, null, 0, 0.2))
        //this.groupExplosions.add(new Explosion(this, 100, 200, null, 0, 0.5))

        /*(Below) - last argument is the context to call the function. Might be possible to call a func inside
        one of the two objects instead - Santiago*/
        this.physics.add.overlap(this.groupBombs, this.groupEnemies, this.bombHitsEnemy, null, this);
        this.physics.add.overlap(this.plrWtich, this.groupExplosions, this.plrBlastJump, null, this);

        // UI
        let placeholderConfig = {
            fontFamily: 'Courier',
            fonstSize: '28px',
            color: '#F0FF5B',
            align: 'left'
        }
        this.add.text(20, 20, "Radical Witch play scene", placeholderConfig);
    }
    

    //Time = time passed since game launch
    //Delta = time since last frame in MS (Whole MS, not fractional seconds)
    update(time, delta) {
        if(!this.gameOver){
            this.plrWtich.update(time, delta);
            //console.log(this.groupExplosions.getLength())
            //Members are removed from the group when they are destroyed. So wtf?
        }
    }

    enemySpawn(){
        this.groupEnemies.add(new Enemy(this, game.config.width,Phaser.Math.Between(150,game.config.height-80),  'enemy', 0, 30).setOrigin(0,0));
    }

    bombHitsEnemy(bomb, enemy){
        console.log("A bomb hit an enemy!");

        // Even if unassociated with the bomb, the explosion still causes issues with update
        // Perhaps it is something to do with the fact that there are two of them
        enemy.destroy();
        bomb.explode();
    }

    // When player and explosion touch, send player upwards
    plrBlastJump(player, explosion){
        console.log("Player caught in blast!");
        explosion.disableBody();
        player.blastJump();
    }
}