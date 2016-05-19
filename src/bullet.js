/**
 * Created by Asic on 5/18/2016.
 */
function Bullet(game){
    this.animation = new Animation(AM.getAsset("./src/img/bullet.png"), 16, 16, 1, 9999, 1, false, 1.0 , null)
    this.speed = 1;
    this.radius = 16 * this.animation.scale;
    this.shape = "circle";
    this.player = game.player;
    this.ctx = game.ctx;
    this.myAngle = 0;
    this.velocity = {x: 31, y: 31};
    this.x = 0;
    this.y = 0;
    Entity.call(this, game, 0, 0);
}

Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
    if (distance(this, this.game.player) > 1000) {
        this.removeFromWorld = true;
    }
    if(this.checkWalls()) this.removeFromWorld = true;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    Entity.prototype.update.call(this);
}

Bullet.prototype.checkWalls = function () {
    var i = Math.floor((this.x + 50) / 400);
    var j = Math.floor((this.y + 50) / 400);
    var currentCell = this.game.maze.grid[i][j];
    var hitWall = false;
    /*
     First we are checking the gaps between our main cells that we draw.
     we must update the mouse xy relative to the player.
     */
    if ((this.x + this.animation.frameWidth * this.animation.scale / 2 > 400 * i + 300) &&
        (this.y + this.animation.frameHeight * this.animation.scale / 4 > 400 * j + 262.5)) {
        var difY = this.y + this.animation.frameHeight * this.animation.scale / 4 - (400 * j + 262.5);
        this.y -= difY;
        this.mouseY -= difY;
        hitWall = true;
    }

    if ((this.x + this.animation.frameWidth * this.animation.scale / 2 > 400 * i + 300) &&
        (this.y + this.animation.frameHeight * this.animation.scale / 4 < 400 * j)) {
        var difY = (400 * j) - (this.y + this.animation.frameHeight * this.animation.scale / 4);
        this.y += difY;
        this.mouseY += difY;
        hitWall = true;
    }

    if ((this.y + this.animation.frameHeight * this.animation.scale / 2 > 400 * j + 300) &&
        (this.x + this.animation.frameWidth * this.animation.scale / 4 > 400 * i + 250)) {
        var difX = this.x + this.animation.frameWidth * this.animation.scale / 4 - (400 * i + 250);
        this.x -= difX;
        this.mouseX -= difX;
        hitWall = true;
    }

    if ((this.y + this.animation.frameHeight * this.animation.scale / 2 > 400 * j + 300) &&
        (this.x + this.animation.frameWidth * this.animation.scale / 4 < 400 * i)) {
        var difX = (400 * i) - (this.x + this.animation.frameWidth * this.animation.scale / 4);
        this.x += difX;
        this.mouseX += difX;
        hitWall = true;
    }


    /*
     Now we check collision in the main cell walls.
     we must also update the mouse xy.
     */
    if (!currentCell.east && this.x + this.animation.frameWidth / 2 > 400 * i + 350) {
        var difX = this.x + this.animation.frameWidth / 2 - (400 * i + 350);
        this.x -= difX;
        this.mouseX -= difX;
        hitWall = true;
    }
    if (!currentCell.south && this.y + this.animation.frameHeight / 2 > 400 * j + 350) {
        var difY = this.y + this.animation.frameHeight / 2 - (400 * j + 350);
        this.y -= difY;
        this.mouseY -= difY;
        hitWall = true;
    }
    if (!currentCell.west && this.x + this.animation.frameWidth * this.animation.scale / 4 < 400 * i) {
        var difX = (400 * i) - (this.x + this.animation.frameWidth * this.animation.scale / 4);
        this.x += difX;
        this.mouseX += difX;
        hitWall = true;
    }
    if (!currentCell.north && this.y + this.animation.frameHeight * this.animation.scale / 4 < 400 * j) {
        var difY = (400 * j) - (this.y + this.animation.frameHeight * this.animation.scale / 4);
        this.y += difY;
        this.mouseY += difY;
        hitWall = true;
    }

    return hitWall;
}

Bullet.prototype.detectCollision = function (theOther) {
    //If the other object is a square then let the square handle collision.
    // if (theOther.shape === "square") {
    //     theOther.detectCollision(this);
    // } else {
    var dist = distance(this, theOther);
    var collisionRange = this.radius + theOther.radius;
    if (dist < collisionRange) {

    }
    //}
}

Bullet.prototype.rotateAndCache = function (that, sx, sy, sw, sh, angle) {
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
}

Bullet.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    this.ctx.strokeStyle = "red";
    this.ctx.rect(this.x, this.y, 16, 16);
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.stroke();
    Entity.prototype.draw.call(this);
}