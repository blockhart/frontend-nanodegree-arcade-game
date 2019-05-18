//Initial variables
const 
    columnIncrement = 101,
    rowIncrement = 83,
    numEnemies = 3,
    minEnemySpeed = 202,
    playerInitX = 202,
    playerInitY = 405,
    playerWinY = -10,
    rightMostPlayerX = 404,
    lastColumn = 505,
    enemyYOffset = -20,
    yGap = 10,
    apparentCollision = 80,
    allEnemies = [];

// Establish Enemy class - I used ES6 for this
class Enemy {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    constructor (x, y, speed) {
        this.sprite = 'images/enemy-bug.png';
        this.x = x;
        this.y = y;
        this.speed = speed; 
    };
    //Manage enemy movement during the period
    update(dt) {
        this.x = this.x + this.speed * dt;
        if (this.x > lastColumn) {
            this.x = columnIncrement * -getRandomInt(2);
            this.y = Math.floor(enemyYOffset + rowIncrement * getRandomInt(3));
            this.speed = Math.floor(minEnemySpeed + columnIncrement * 3 * Math.random());
        }
    };
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
};

// Estalish player "Class" - I used ES5 for this

function Player(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
};

// Check for player position relative to enemies
Player.prototype.update = function(key) {
    if (this.y === playerWinY) {
        console.log("Win!");
        this.x = playerInitX;
        this.y = playerInitY;
    };
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Move player based on keyboard inputs
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
};

// Now instantiate your objects.
// Create and place all enemy objects in an array called allEnemies
for (let i = 0; i < numEnemies; i++) {
    let firstX = Math.floor(columnIncrement * -getRandomInt(5));
    let firstY = Math.floor(enemyYOffset + rowIncrement * getRandomInt(3));
    let newSpeed = Math.floor(minEnemySpeed + columnIncrement * 3 * Math.random());
    let enemy = new Enemy(firstX, firstY, newSpeed);
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
        let checkRow = ((player.y - yGap) === enemy.y);
        let checkLeft = ((player.x > enemy.x) && (player.x < (enemy.x + apparentCollision)));       
        let checkRight = ((enemy.x > player.x) && (enemy.x < (player.x + apparentCollision)));
        if (checkRow && (checkLeft || checkRight)) {
            console.log("You collided with an enemy!")
            player.x = playerInitX;
            player.y = playerInitY;
        };
    });
};

// This listens for key presses and sends the keys to the
// Player.update() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
