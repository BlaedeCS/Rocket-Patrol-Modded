//Blaede Court-Suzuki
// Rocket Patrol w. mods
// >2 hours
// 1 point : Music (I recorded my voice in Audacity, edited it into an audio file, looped and quieted it, and made audio reset when exiting the level)
// 1 point : Post-firing control (Now the player can still move the rocket left and right while it's firing)
// 3 points : Time display (green text to the right of score, displays in seconds)
// 5 points : Smaller enemy type (Made a smaller enemy type, you can distinguish it because of the color and watch it fly over the borders to be sure of its movement, added a speed increase stat so they're faster than normal spaceships)
// 5 points : Time adjustments (Made ships reward 20% of their points in seconds on the clock, and missing ships cost 15 seconds)
// 5 points : Mouse control (moving mouse on screen will make rocket move to align with it before giving you arrow control, left clicking fires rocket)
// Just used phaser.js, the phaser.d.ts file we've used in some assignments, and my knowledge from reading the instructions for past assignments to implement these

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3