//Initial variables
const 
    columnIncrement = 101,
    rowIncrement = 83,
    numEnemies = 3,
    minEnemySpeed = 202,
    playerInitX = 202,
    rightMostPlayerX = 404,
    playerInitY = 405,
    lastColumn = 505,
    enemyYOffset = -20,
    yGap = 10,
    apparentCollision = 80,
    allEnemies = [];


// Enemies our player must avoid
function Enemy(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    if (this.x > lastColumn) {
        this.x = columnIncrement * -getRandomInt(2);
        this.y = Math.floor(enemyYOffset + rowIncrement * getRandomInt(3));
        this.speed = Math.floor(minEnemySpeed + columnIncrement * 3 * Math.random());
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

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
    switch (key) {
        case "left":
            this.x = Math.max(0,this.x - columnIncrement);
            break;
        case "right":
            this.x = Math.min(rightMostPlayerX,this.x + columnIncrement);
            break;
        case "up":
            this.y = this.y - rowIncrement;
            break;
        case "down":
            this.y = Math.min(playerInitY,this.y + rowIncrement);
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies

for (let i = 0; i < numEnemies; i++) {
    let newX = Math.floor(columnIncrement * -getRandomInt(5));
    let newy = Math.floor(enemyYOffset + rowIncrement * getRandomInt(3));
    let newSpeed = Math.floor(minEnemySpeed + columnIncrement * 3 * Math.random());
    let enemy = new Enemy(newX, newy, newSpeed);
    allEnemies.push(enemy);
}

function getRandomInt(max) {
    return 1 + Math.floor(Math.random() * max);
};

// Place the player object in a variable called player
var player = new Player(playerInitX,playerInitY);

function checkCollisions (a,b) {
    b.forEach(function(enemy) {
        let checkRow = ((a.y - yGap) === enemy.y);
        let checkLeft = ((a.x > enemy.x) && (a.x < (enemy.x + apparentCollision)));       
        let checkRight = ((enemy.x > a.x) && (enemy.x < (a.x + apparentCollision)));
        if (checkRow && (checkLeft || checkRight)) {
            a.x = playerInitX;
            a.y = playerInitY;
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

    player.update(allowedKeys[e.keyCode]);
});
