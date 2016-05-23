/**
 * Created by asic on 5/22/2016.
 */
function TitleScreen(game, thegame){
    this.animation = new Animation(AM.getAsset("./src/img/TitleScreen.jpg"), 1600, 900, 1, 9999, 1, false, 1.0 , null);
    this.ctx = game.ctx;
    this.game = game;
    this.gameEngine = thegame;
    Entity.call(this, game, 0, 0);
    this.x = 0;
    this.y = 0;
    var that = this;
    this.gameStarted = false;

    this.ctx.canvas.addEventListener("click", function () {
        if (that.gameStarted == false) {
            that.gameEngine.init(that.ctx);
            that.gameEngine.initMaze(20);
            that.gameEngine.showOutlines = false;

            //gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./src/img/background.jpg")));
            var player = new Survivor(that.gameEngine, AM.getAsset("./src/img/survivor_handgun_idle_sprite.png"));
            that.gameEngine.addEntity(player);
            that.gameEngine.player = player;

            for (var i = 0; i < 50; i++) {
                that.gameEngine.addEntity(new Zombie(that.gameEngine, AM.getAsset("./src/img/zombie_sprite.png")));
            }
            for (var i = 0; i < 20; i++) {
                that.gameEngine.addEntity(new Pickup(that.gameEngine));
            }

            that.gameEngine.HUD = new HUD(that.gameEngine);
            that.gameStarted = true;
            that.gameEngine.start("MainGame");
        }
    });
}

TitleScreen.prototype = new Entity();
TitleScreen.prototype.constructor = TitleScreen;

TitleScreen.prototype.update = function() {
    this.x = 0;
    this.y = 0;
};

TitleScreen.prototype.rotateAndCache = function (that, sx, sy, sw, sh, angle) {
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

TitleScreen.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, 0, 0);
    Entity.prototype.draw.call(this);
};