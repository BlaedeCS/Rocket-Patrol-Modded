class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0)

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0,0,borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0)
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
    
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0,0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0,0)
        
        // add smallships (x2)

        this.ship04 = new Smallship(this, game.config.width + borderUISize * 13, borderUISize * 3.5, 'smallship', 0, 50).setOrigin(0,0)
        this.ship05 = new Smallship(this, game.config.width + borderUISize * 9, borderUISize * 4.5 + borderPadding*2, 'smallship', 0, 40).setOrigin(0,0)
        

        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    
        // init score
        this.p1Score = 0
        this.timerValue = game.settings.gameTimer
        
        // display score
        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, this.scoreConfig)
        

        // display time
        this.timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#D4F3B4',
            color: '#156631',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeLeft = this.add.text(borderUISize * 4 + borderPadding * 4, borderUISize + borderPadding * 2, this.timerValue / 1000, this.timeConfig)
        
        
        // GAME OVER flag
        this.gameOver = false
        
        // 60-second clock
        this.scoreConfig.fixedWidth = 0
        this.recursiveTimer()

        let music = this.sound.add('ost-airstimation')

        music.play()
        music.volume = 0.1
        music.loop = true


    }

    update() {
        // check timer for amount remaining
        if (this.timerValue <= 0) {
            let scoreConfig = this.scoreConfig
            this.add.text(game.config.width/2,game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2,game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        }


        // check input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.sound.removeAll()
            this.scene.restart()
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
            this.sound.removeAll()
        }

        if (!this.gameOver) {
            this.starfield.tilePositionX -= 4
        }
        

        if (!this.gameOver){
            this.p1Rocket.update()

            this.ship01.update()
            this.ship02.update()
            this.ship03.update()

            this.ship04.update()
            this.ship05.update()
        }

        //check collisions
        if (this.p1Rocket.failed) {
            this.timerValue -= 15000
            if (this.timerValue < 0) {
                this.timeLeft.text = 0
            } else {
                this.timeLeft.text = this.timerValue / 1000
            }
            
            this.p1Rocket.failed = false
        }

        if (this.checkCollision(this.p1Rocket,this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if (this.checkCollision(this.p1Rocket,this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if (this.checkCollision(this.p1Rocket,this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
        if (this.checkCollision(this.p1Rocket,this.ship05)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship05)
        }
        if (this.checkCollision(this.p1Rocket,this.ship04)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship04)
        }

        if (this.input.mousePointer.leftButtonDown() && !this.p1Rocket.isFiring) {
            this.p1Rocket.clickFire = true
        }

        if (this.input.mousePointer.worldX != this.p1Rocket.mouseSway) {
            this.p1Rocket.mouseSway = this.input.mousePointer.worldX
            this.p1Rocket.mouseReached = false
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true
            } else {
                return false
            }
    }

    shipExplode(ship) {
        // temp hide ship
        ship.alpha = 0

        // make explosion
        let boom = this.add.sprite(ship.x,ship.y, 'explosion').setOrigin(0,0)
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })
        // score add and text update
        this.p1Score += ship.points
        this.timerValue += ship.points * 200
        this.timeLeft.text = this.timerValue / 1000
        this.scoreLeft.text = this.p1Score

        this.sound.play('sfx-explosion')
    }


    recursiveTimer() {
        if (this.timerValue > 0) {
            this.clock = this.time.delayedCall(1000, () => {
                this.timerValue -= 1000
                this.recursiveTimer()
                if (this.timerValue < 0) {
                    this.timeLeft.text = 0
                } else {
                    this.timeLeft.text = this.timerValue / 1000
                }
            }, null, this)
        }
    }
}