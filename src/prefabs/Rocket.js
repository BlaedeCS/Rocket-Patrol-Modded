// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        // add object to existing scene
        scene.add.existing(this)
        this.isFiring = false
        this.moveSpeed = 2

        // sound
        this.sfxShot = scene.sound.add('sfx-shot')

        this.failed = false

        this.clickFire = false
        this.mouseSway = 0
        this.mouseReached = true
    }

    update() {
        // lr movement
        if(!this.isFiring || this.isFiring) {
            
            if(this.mouseSway != this.x && !this.mouseReached){
                this.lastMouse = this.mouseSway
                if (this.mouseSway < this.x) {
                    this.x -= this.moveSpeed
                    if (this.mouseSway >= this.x) {
                        this.x = this.mouseSway
                        this.mouseReached = true
                    }
                } else {
                    this.x += this.moveSpeed
                    if (this.mouseSway <= this.x) {
                        this.x = this.mouseSway
                        this.mouseReached = true
                    }
                }
            } else if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed
            } else if(keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed
            }
        }

        //fire button
        if(Phaser.Input.Keyboard.JustDown(keyFIRE) && !this.isFiring) {
            this.isFiring = true
            this.sfxShot.play()
        }
        //fire click
        if(this.clickFire && !this.isFiring) {
            this.isFiring = true
            this.sfxShot.play()
            this.clickFire = false
        }

        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed
        }

        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.isFiring = false
            this.y = game.config.height - borderUISize - borderPadding
            this.failed = true
        }
    }

    reset() {
        this.isFiring = false
        this.y = game.config.height - borderUISize - borderPadding
    }
}