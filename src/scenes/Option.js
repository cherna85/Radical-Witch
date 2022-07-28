class Option extends Phaser.Scene {
    constructor() {
        super('optionsScene');
    }

    create() {
        keySelect = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    
        let MenuConfig = {
            //font from https://fonts.google.com/specimen/Press+Start+2P
            //https://www.1001fonts.com/sortelo-font.html
            fontFamily:  'PressStart2P', 
            fontSize: '20px',
            backgroundColor: null,
            color: '#FFFFFF',
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#FEC093',
                blur: 10,
                stroke: true,
                fill: true
            }, padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
        }
        
        this.add.text(game.config.width/2, 96, "Options", MenuConfig).setOrigin(0.5);
        //Text options
        MenuConfig.fontSize = '16px';
        MenuConfig.color =  '#FF994F';
        //Starting text is what the volume is currently
        this.textMusic = this.add.text(game.config.width/2, game.config.height/2,
        "Music Volume < " + this.game.music.volume + " >", MenuConfig).setOrigin(0.5);
        MenuConfig.shadow.blur =  0;
        MenuConfig.color =  '#FFFFFF';
        this.textSound = this.add.text(game.config.width/2, game.config.height/2 + 32,
         "Sound Volume < " + this.game.sound.volume + " >", MenuConfig).setOrigin(0.5);
        this.textReturn = this.add.text(game.config.width/2, game.config.height/2 + 64,
        "Return", MenuConfig).setOrigin(0.5);

        this.rows = {
            0: this.textMusic,
            1: this.textSound,
            2: this.textReturn
        }
        this.currentRow = 0;
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyDown))
            this.changeRow(1);
        else if(Phaser.Input.Keyboard.JustDown(keyUp))
            this.changeRow(-1);

        if(Phaser.Input.Keyboard.JustDown(keyLeft))
            this.changeVolume(this.rows[this.currentRow], -1);
        else if(Phaser.Input.Keyboard.JustDown(keyRight))
            this.changeVolume(this.rows[this.currentRow], 1);

        //Return to main menu & Update the volume on the save file
        if(Phaser.Input.Keyboard.JustDown(keySelect) && this.rows[this.currentRow] == this.textReturn){
            localStorage.setItem('musicVolume', game.music.volume);
            localStorage.setItem('soundVolume', game.sound.volume);
            this.scene.start('menuScene');
        }

        let musicDisplayVol = Math.round(this.game.music.volume * 10) / 10
        this.textMusic.setText("Music Volume < " + musicDisplayVol + " >");
        let soundDisplayVol = Math.round(this.game.sound.volume * 10) / 10
        this.textSound.setText("Sound Volume < " + soundDisplayVol + " >");
    }

    changeRow(posChange){
        //Set current row text to normal
        this.rows[this.currentRow].setShadowBlur(0);
        this.rows[this.currentRow].setColor('#FFFFFF');

        this.currentRow += posChange;
        if(this.currentRow > 2){ //Causes selection to loop
            this.currentRow = 0;
        }
        else if(this.currentRow < 0){
            this.currentRow = 2;
        }

        //Sets new selection to be colored
        this.rows[this.currentRow].setShadowBlur(10);
        this.rows[this.currentRow].setColor('#FF994F');
    }

    changeVolume(audioChannel, direction){
        let changeAmount = direction * 0.1;
        if(audioChannel == this.textMusic){
            //Update the volume level
            let newVolume = this.game.music.volume += changeAmount;
            newVolume = Math.min(Math.max(newVolume, 0.0), 2.0);
            this.game.music.volume = newVolume; //Doesn't update to 0.9 if I go left first?
            //It doesn't change until the next frame
            console.log("True volume: " + newVolume)
        }
        else if(audioChannel == this.textSound){
            let newVolume = this.game.sound.volume += changeAmount;
            newVolume = Math.min(Math.max(newVolume, 0.0), 2.0);
            this.game.sound.volume = newVolume;

            console.log("True volume: " + newVolume)
            this.time.addEvent({delay: 1, callback: () => {
                this.sound.play('sfx_button');
            }})
        }
    }
}