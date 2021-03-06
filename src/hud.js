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
    this.ctx.translate(this.game.player.x - (this.ctx.canvas.width / 2), this.game.player.y - (this.ctx.canvas.height / 2));
    this.animation.drawFrame(this.game.clockTick, this.ctx, 0, 0);
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillRect(145, 42, 300 * ((this.game.player.health > 0) ? (this.game.player.health / this.game.player.maxHealth) : 0), 25);
    this.ctx.fillStyle = "#0000FF";
    this.ctx.fillRect(145, 75, 300 * ((this.game.player.water > 0) ? (this.game.player.water / this.game.player.maxWater) : 0), 25);
    this.ctx.fillStyle = "#000000";
    this.ctx.font="30px Verdana";
    this.ctx.fillText(this.game.player.ammo, 180, 134);

    //Minimap code
    var mapSize = 180;
    var mapPos = {x: 25, y: 160};
    var gridSpace = mapSize / this.game.maze.grid.length;
    this.ctx.fillStyle = "rgba(46, 130, 46, 1)";
    if (this.game.player.hasMap || this.game.player.hasGPS) {
        this.ctx.fillRect(mapPos.x, mapPos.y, mapSize, mapSize);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(mapPos.x, mapPos.y, mapSize, mapSize);
        this.ctx.lineWidth = 2;
    }

    if (this.game.player.hasMap) {
        for(var x = 0; x < this.game.maze.grid.length; x++) {
            for(var y = 0; y < this.game.maze.grid.length; y++) {

                this.ctx.strokeStyle = "rgba(0, 0, 0, 1)";
                var dx = mapPos.x + (x * gridSpace);
                var dy = mapPos.y + (y * gridSpace);
                var dw = gridSpace;
                var dh = gridSpace;
                var cell = this.game.maze.grid[x][y];
                this.ctx.strokeRect(dx,dy,dw,dh);


                this.ctx.fillStyle = "rgba(46, 130, 46, 1)";
                if (cell.north) {
                    dy -= 1;
                }
                if (cell.south) {
                    dh += 1;
                }
                if (cell.east) {
                    dw += 1;
                }
                if (cell.west) {
                    dx -= 1;
                }
                this.ctx.fillRect(dx,dy,dw,dh);
            }
        }
    }

    if (this.game.player.hasGPS) {
        this.ctx.fillStyle = "yellow";
        var pw = gridSpace / 3;
        var ph = gridSpace / 3;
        var px = mapPos.x + ((this.game.player.x / 400)* gridSpace) - (pw/2);
        var py = mapPos.y + ((this.game.player.y / 400) * gridSpace) - (ph/2);
        this.ctx.fillRect(px, py, pw, ph);
        this.ctx.fillStyle = "rgba(0,255,0,1)";
        this.ctx.fillRect(mapPos.x + mapSize - (pw * 2), mapPos.y + mapSize - (pw * 2), gridSpace / 3, gridSpace / 3);
    }

    this.ctx.restore();
    Entity.prototype.draw.call(this);
};