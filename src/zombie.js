function Zombie(game, spritesheet){
    this.animation = new Animation(spritesheet, 288, 314, 5, 0.11, 15, true, 0.4, this);
    this.speed = 3 + Math.random() * 4;
    this.radius = 157 * this.animation.scale;
    this.shape = "circle";
    this.player = game.player;
    this.ctx = game.ctx;
    this.myAngle = 0;
    Entity.call(this, game, Math.floor(Math.random() * game.maze.grid.length) * 400 + 200, Math.floor(Math.random() * game.maze.grid[0].length) * 400 + 200);
}
// comment
Zombie.prototype = new Entity();
Zombie.prototype.constructor = Zombie;

Zombie.prototype.update = function() {
    if (distance(this, this.player) > this.radius) {
        this.x += this.speed * (this.player.x - this.x) /
            (distance(this, this.player));
        this.y += this.speed * (this.player.y - this.y) /
            (distance(this, this.player));
    }
    this.checkWalls();
    var x = (this.x +((this.animation.frameWidth/2) * this.animation.scale)) -
        (this.player.x + (this.player.animation.frameWidth / 2) * this.player.animation.scale);
    var y = (this.y + ((this.animation.frameHeight/2) * this.animation.scale)) -
        (this.player.y + (this.player.animation.frameHeight / 2) * this.player.animation.scale);
    this.myAngle = ((Math.atan2(y, x) - Math.atan2(0, 0)) * 180/ Math.PI) + 180;
    Entity.prototype.update.call(this);
};

Zombie.prototype.checkWalls = function () {
    var i = Math.floor((this.x + 50) / 400);
    var j = Math.floor((this.y + 50) / 400);
    var currentCell = this.game.maze.grid[i][j];

    /*
     First we are checking the gaps between our main cells that we draw.
     we must update the mouse xy relative to the player.
     */
    var difX = 0;
    var difY = 0;
    if ((this.x + this.animation.frameWidth * this.animation.scale / 2 > 400 * i + 300) &&
        (this.y + this.animation.frameHeight * this.animation.scale / 4 > 400 * j + 262.5)) {
        difY = this.y + this.animation.frameHeight * this.animation.scale / 4 - (400 * j + 262.5);
        this.y -= difY;
    }


    if ((this.x + this.animation.frameWidth * this.animation.scale / 2 > 400 * i + 300) &&
        (this.y + this.animation.frameHeight * this.animation.scale / 4 < 400 * j)) {
        difY = (400 * j) - (this.y + this.animation.frameHeight * this.animation.scale / 4);
        this.y += difY;
    }

    if ((this.y + this.animation.frameHeight * this.animation.scale / 2 > 400 * j + 300) &&
        (this.x + this.animation.frameWidth * this.animation.scale / 4 > 400 * i + 237.5)) {
        difX = this.x + this.animation.frameWidth * this.animation.scale / 4 - (400 * i + 237.5);
        this.x -= difX;
    }

    if ((this.y + this.animation.frameHeight * this.animation.scale / 2 > 400 * j + 300) &&
        (this.x + this.animation.frameWidth * this.animation.scale / 4 < 400 * i)) {
        difX = (400 * i) - (this.x + this.animation.frameWidth * this.animation.scale / 4);
        this.x += difX;

    }


    /*
     Now we check collision in the main cell walls.
     we must also update the mouse xy.
     */
    if (!currentCell.east && this.x + this.animation.frameWidth / 2 > 400 * i + 350) {
        difX = this.x + this.animation.frameWidth / 2 - (400 * i + 350);
        this.x -= difX;
    }
    if (!currentCell.south && this.y + this.animation.frameHeight / 2 > 400 * j + 387.5) {
        difY = this.y + this.animation.frameHeight / 2 - (400 * j + 387.5);
        this.y -= difY;
    }
    if (!currentCell.west && this.x + this.animation.frameWidth * this.animation.scale / 4 < 400 * i) {
        difX = (400 * i) - (this.x + this.animation.frameWidth * this.animation.scale / 4);
        this.x += difX;
    }
    if (!currentCell.north && this.y + this.animation.frameHeight * this.animation.scale / 4 < 400 * j) {
        difY = (400 * j) - (this.y + this.animation.frameHeight * this.animation.scale / 4);
        this.y += difY;
    }
};

Zombie.prototype.detectCollision = function (theOther) {
    var dist = distance(this, theOther);
    if (dist > 1000) return;
    var collisionRange = this.radius * this.animation.scale + theOther.radius * theOther.animation.scale;
    var diff = collisionRange - dist;
    if (dist < collisionRange) {
        if (theOther instanceof Bullet) {
            this.removeFromWorld = true;
            theOther.removeFromWorld = true;
        } else {
            if (this.x < theOther.x) {
                this.x -= diff / 2;
                theOther.x += diff / 2;
                if (this.y < theOther.y) {
                    this.y -= diff / 2;
                    theOther.y += diff / 2;
                } else {
                    this.y += diff / 2;
                    theOther.y -= diff / 2;
                }
            } else if (this.y < theOther.y) {
                this.x += diff / 2;
                theOther.x -= diff / 2;
                this.y -= diff / 2;
                theOther.y += diff / 2;
            } else {
                this.x += diff / 2;
                theOther.x -= diff / 2;
                this.y += diff / 2;
                theOther.y -= diff / 2;
            }
        }
    }
};

Zombie.prototype.rotateAndCache = function (that, sx, sy, sw, sh, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(that.animation.frameWidth, that.animation.frameHeight);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle*Math.PI/180);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(that.animation.spriteSheet, sx, sy, sw, sh, -(that.animation.frameWidth / 2),
        -(that.animation.frameHeight / 2), that.animation.frameWidth, that.animation.frameHeight);
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
};

Zombie.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    // this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // this.ctx.stroke();
    // this.ctx.closePath();
    Entity.prototype.draw.call(this);
};
