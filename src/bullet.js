/**
 * Created by Asic on 5/18/2016.
 */
function Bullet(game){
    this.animation = new Animation(AM.getAsset("./src/img/bullet.png", 14, 14, 1, 0.11, 1, true, 1.0 , null));
    this.speed = 1;
    this.radius = 157 * this.animation.scale;
    this.shape = "circle";
    this.player = game.player;
    this.ctx = game.ctx;
    this.myAngle = 0;
    this.x = 0;
    this.y = 0;
    Entity.call(this, game, Math.floor(Math.random() * 800), Math.floor(Math.random() * 600));
}

Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
    // if (distance(this, this.player) > this.radius) {
    //     this.x += this.speed * (this.player.x - this.x) /
    //         (distance(this, this.player));
    //     this.y += this.speed * (this.player.y - this.y) /
    //         (distance(this, this.player));
    // }
    // var x = (this.x +((this.animation.frameWidth/2) * this.animation.scale)) -
    //     (this.player.x + (this.player.animation.frameWidth / 2) * this.player.animation.scale);
    // var y = (this.y + ((this.animation.frameHeight/2) * this.animation.scale)) -
    //     (this.player.y + (this.player.animation.frameHeight / 2) * this.player.animation.scale);
    //this.myAngle = ((Math.atan2(y, x) - Math.atan2(0, 0)) * 180/ Math.PI) + 180;
    Entity.prototype.update.call(this);
}

Bullet.prototype.detectCollision = function (theOther) {
    //If the other object is a square then let the square handle collision.
    // if (theOther.shape === "square") {
    //     theOther.detectCollision(this);
    // } else {
    var dist = distance(this, theOther);
    var collisionRange = this.radius;
    if (dist < collisionRange) {
        this.x -= this.speed * .009 * (theOther.x - this.x);
        this.y -= this.speed * .009 * (theOther.y - this.y);
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
    this.ctx.strokeStyle = "#00FFFF";
    this.ctx.rect(this.x, this.y, ((this.animation.frameWidth) * this.animation.scale), ((this.animation.frameHeight) * this.animation.scale));
    this.ctx.stroke();
    Entity.prototype.draw.call(this);
}