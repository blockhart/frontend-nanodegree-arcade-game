//Initialize variables
const 
    columnIncrement = 101,
    rowIncrement = 83,
    numEnemies = 3,
    speedModifier = 3,
    playerInitX = 202,
    playerInitY = 405,
    playerWinY = -10,
    rightMostPlayerX = 404,
    lastColumn = 505,
    enemyYOffset = -20,
    yGap = 10,
    apparentCollision = 80,
    winDelay = 5,
    blinkingDelay = 3500,
    blinkInterval = 500,
    allEnemies = [];

let disableInput = false,
    drawOn = true,
    firstPass = true,
    minEnemySpeed = 202,
    blinkPlayer;

// Sound effects obtained from zapsplat.com (https//ww.zapsplat.com)
const jumpNoise = new Audio('sounds/zapsplat_cartoon_frog_jump_26526.mp3'),
    collisionNoise = new Audio('sounds/zapsplat_multimedia_game_sound_error_incorrect_004_30724.mp3'),
    splashNoise = new Audio('sounds/zapsplat_foley_stone_small_throw_into_puddle_water_splash_002_29841.mp3');

// Establish Enemy class - I used ES6 for this for future viewing
class Enemy {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    constructor () {
        this.sprite = 'images/enemy-bug.png';
/*        this.x = x;
        this.y = y;
        this.speed = speed; */
    };
    //Calculations for enemy movement during the period
    update(dt) {
        this.x = this.x + this.speed * dt;
        //when enemy moves off canvas, recalc position and speed within 2 columns to left of canvas
        if (this.x > lastColumn) {
            this.newPosAndSpeed(2);
        }
    };
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
    //setting new position and speed for enemy
    newPosAndSpeed(column) {
        //calc new enemy x, within two columns of left of canvas
        this.x = columnIncrement * -getRandomInt(column);
        //calc new enemy y, one of the three rows that are grey
        this.y = Math.floor(enemyYOffset + rowIncrement * getRandomInt(3));
        //calc new eneny speed, with minimum and random additional amount
        this.speed = Math.floor(minEnemySpeed + columnIncrement * speedModifier * Math.random());
    };
    //for holding enemy in place after a collision
    enemyHold() {
        let enemy = this;
        let temp = this.speed;
        this.speed = 0;
        let restartEnemy = setTimeout(function(){
            enemy.speed = temp;
            minEnemySpeed = 202;
        },blinkingDelay,enemy,temp)
    };
};

// Estalish player "Class" - I used ES5 for this for future viewing
function Player(x, y) {
    this.sprite = 'images/char-horn-girl.png';
    this.x = x;
    this.y = y;
};

//since movement calc is in handleInput, I used this for the 'win' check
Player.prototype.update = function(key) {
    //if position in "win" water row, initiate noise and blinking
    //firstPass test required since this update() is called each canvas pass
    if (this.y === playerWinY && firstPass) {
        splashNoise.play();
        playerBlink();
        // after win, speed up bugs by 10%
        minEnemySpeed = minEnemySpeed * 1.1;
    };
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    //drawOn coordinates with the 'playerBlink()' function
    if (drawOn) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
};

// Calc new player position based on keyboard inputs
Player.prototype.handleInput = function(key) {
    switch (key) {
        case "left":
            this.x = Math.max(0,this.x - columnIncrement);
            break;
        case "right":
            this.x = Math.min(rightMostPlayerX,this.x + columnIncrement);
            break;
        case "up":
            this.y = Math.max(playerWinY, this.y - rowIncrement);
            break;
        case "down":
            this.y = Math.min(playerInitY,this.y + rowIncrement);
    };
    //for arrow-key inputs that will move player, play jumpNoise
    if (key == "left" || key == "right" || key == "up" || key == "down") {
        jumpNoise.play();
    };
};

// Now instantiate your objects.
// Create and place all enemy objects in an array called allEnemies
for (let i = 0; i < numEnemies; i++) {
    let enemy = new Enemy();
    //for each new enemy, start them within 5 columns left of canvas
    enemy.newPosAndSpeed(5);
    allEnemies.push(enemy);
}

function getRandomInt(max) {
    return 1 + Math.floor(Math.random() * max);
};

// Place the player object in a variable called player
var player = new Player(playerInitX,playerInitY);

// Check for collisions and, if so, reset play to init position
function checkCollisions () {
    allEnemies.forEach(function(enemy) {
        // if on same row, "yGap" adjusts for different offsets required for centering
        let checkRow = ((player.y - yGap) === enemy.y);
        // if left side of player hits right side of enemy
        let checkLeft = ((player.x > enemy.x) && (player.x < (enemy.x + apparentCollision)));
        // if right side of player hits left side of enemy     
        let checkRight = ((enemy.x > player.x) && (enemy.x < (player.x + apparentCollision)));
        if (checkRow && (checkLeft || checkRight) && firstPass) {
            playerBlink();
            enemy.enemyHold();
            collisionNoise.play();
        };
    });
};

function playerBlink() {
    //during period of blinking, set firstPass so player.update() doesn't repeatly call this function
    firstPass = false;
    disableInput = true;
    //alternate "drawOn" so render of player goes on and off each 0.5 seconds
    let blinker = setInterval(function() {
       drawOn = drawOn === true ? false : true;
    },blinkInterval);
    // after 3.5 seconds, turn off blinking, reset player
    let blinkerOff = setTimeout(function(){
        clearInterval(blinker);
        drawOn = true;
        firstPass = true;
        disableInput = false;
        player.x = playerInitX;
        player.y = playerInitY;
    },blinkingDelay);
}

// This listens for key presses and sends the keys to the
// Player.update() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (disableInput === false) {
        player.handleInput(allowedKeys[e.keyCode]); 
    };
   
});
