/**
 * Created by asic on 5/22/2016.
 */
function HUD(game){
    this.animation = new Animation(AM.getAsset("./src/img/HUD.png"), 1600, 900, 1, 9999, 1, false, 1.0 , null);
    this.ctx = game.ctx;
    this.game = game;
    Entity.call(this, game, 0, 0);
    this.gameStarted = false;
}

HUD.prototype = new Entity();
HUD.prototype.constructor = HUD;

HUD.prototype.update = function() {
    this.x = 0;
    this.y = 0;
};

HUD.prototype.rotateAndCache = function (that, sx, sy, sw, sh, angle) {
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

HUD.prototype.draw = function () {
    this.ctx.save();
    this.ctx.translate(this.game.player.x - 800, this.game.player.y - 450);
    this.animation.drawFrame(this.game.clockTick, this.ctx, 0, 0);
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillRect(145, 42, 300 * (this.game.player.health / this.game.player.maxHealth), 25);
    this.ctx.fillStyle = "#0000FF";
    this.ctx.fillRect(145, 75, 300 * (this.game.player.water / this.game.player.maxWater), 25);
    this.ctx.restore();
    Entity.prototype.draw.call(this);
};