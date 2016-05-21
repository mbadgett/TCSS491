/**
 * Created by asic on 5/21/2016.
 */
function Pickup(game){
    this.types = ["health", "ammo", "water", "radpills"];
    this.typeOf = Math.floor(Math.random() * 3);
    this.animation = new Animation(AM.getAsset("./src/img/pickups/" + this.types[this.typeOf] + ".png"), 64, 64, 1, 9999, 1, true, 1, null);
    this.radius = 157 * this.animation.scale;
    this.player = game.player;
    this.ctx = game.ctx;
    this.myAngle = 0;
    this.game = game;
    Entity.call(this, game, Math.floor(Math.random() * game.maze.grid.length) * 400 + 200, Math.floor(Math.random() * game.maze.grid[0].length) * 400 + 200);
}
// comment
Pickup.prototype = new Entity();
Pickup.prototype.constructor = Pickup;

Pickup.prototype.update = function() {
    Entity.prototype.update.call(this);
};

Pickup.prototype.detectCollision = function (theOther) {
    
};

Pickup.prototype.applyEffect = function () {
    switch(this.typeOf) {
        case 0:
            //Health
            this.game.player.health += 455;
            if (this.game.player.health > 1000) {
                this.game.player.health = 1000;
            }
            break;
        case 1:
            //Ammo
            this.game.player.ammo += Math.ceil(Math.random() * 8);
            break;
        case 2:
            //Water
            this.game.player.water += 35;
            if (this.game.player.water > 100) {
                this.game.player.water = 100;
            }
            break;
        case 3:
            //Rad Pills
            this.game.player.radiation -= 20;
            if ( this.game.player.radiation < 0 ) {
                this.game.player.radiation = 0;
            }
            break;
    }
};

Pickup.prototype.rotateAndCache = function (that, sx, sy, sw, sh, angle) {
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
    return offscreenCanvas;
};

Pickup.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};
