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

        this.enemy01 = new Enemy(this, game.config.width, Phaser.Math.Between(150,game.config.height-80),  'enemy', 0, 30).setOrigin(0,0);
        this.enemy02 = new Enemy(this, game.config.width + 40, Phaser.Math.Between(150,game.config.height-80),  'enemy', 0, 30).setOrigin(0,0);

        // Physics groups & collisions - Santiago
        this.groupEnemies = this.physics.add.group();
        this.groupEnemies.defaults = {}; //Prevents group from chainging properies (such as gravity) of added objects
        this.groupEnemies.add(this.enemy01);
        this.groupEnemies.add(this.enemy02);
        
        this.groupBombs = this.physics.add.group();
        this.groupEnemies.defaults = {};

        this.groupExplosions = this.physics.add.staticGroup();
        this.groupExplosions.add(new Explosion(this, 100, 200))

        /*(Below) - last argument is the context to call the function. Might be possible to call a func inside
        one of the two objects instead - Santiago*/
        this.physics.add.overlap(this.groupBombs, this.groupEnemies, this.bombHitsEnemy, null, this);
        //For some reason, explosion does not affect player (even when I made a func in this scene)
        this.physics.add.overlap(this.groupExplosions, this.plrWtich, this.plrWtich.blastJump, null, this.plrWtich);
    }
    

    //Time = time passed since game launch
    //Delta = time since last frame in MS (Whole MS, not fractional seconds)
    update(time, delta) {
        this.plrWtich.update(time, delta);

        //moves the ship
        if(!this.gameOver){
            this.enemy01.update();
            this.enemy02.update();

            //The crash here seems to be caused by a bomb hitting two enemies at the same time
            //My guess is that the collide function is called for the bomb and one enemy first, creating an explosion, then destroying the bomb right afterwards
            //Then the func is called for the same bomb with the 2nd enemy, but that bomb is gone now. The resulting explosion is undefined because it was given bomb's
            //x and y coords after it was destroyed
            //Test: moving explosion spawn to the bomb class will allow only one explosion to be created
            this.groupExplosions.children.iterate(function (child) {
                child.update(time, delta);
            });
            //console.log(this.groupExplosions.getLength())
            //Members are removed from the group when they are destroyed. So wtf?
        }
        
        
    }
    //temp
    checkCollision(witch, enemy){
        //AABB checking
        if(witch.x < enemy.x + enemy.width && 
            witch.x + witch.width > enemy.x &&
            witch.y < enemy.y + enemy.height &&
            witch.height + witch.y > enemy.y){
                return true;
            }else {
                return false;
            }
    }
    enemySpawner(){
        //pass
    }

    bombHitsEnemy(bomb, enemy){
        console.log("A bomb hit an enemy!");

        enemy.destroy();
        if(bomb != null)
            bomb.explode();
    }
}