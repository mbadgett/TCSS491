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

    var startGame = function () {
        if (that.gameStarted == false) {
            that.gameEngine.init(that.ctx);
            that.gameEngine.initMaze(10);
            that.gameEngine.showOutlines = false;

            var player = new Survivor(thegame, AM.getAsset("./src/img/survivor_handgun_idle_sprite.png"));
            that.gameEngine.addEntity(player);
            that.gameEngine.player = player;

            for (var i = 0; i < 20; i++) {
                var zombie = new Zombie(that.gameEngine, AM.getAsset("./src/img/zombie_sprite.png"));
                if (distance(player, zombie) > 500) {
                    that.gameEngine.addEntity(zombie);
                } else i--;
            }
            for (var i = 0; i < 20; i++) {
                that.gameEngine.addEntity(new Pickup(that.gameEngine));
            }

            that.gameEngine.HUD = new HUD(that.gameEngine);
            that.gameEngine.ctx.canvas.addEventListener("resize", function (e) {
                that.gameEngine.ctx.canvas.width  = window.innerWidth;
                that.gameEngine.ctx.canvas.height = window.innerHeight;
            }, false);

            that.gameStarted = true;

            that.gameEngine.start("MainGame");
            that.ctx.canvas.removeEventListener("click", startGame);
        }
    };
    this.ctx.canvas.addEventListener("click", startGame);
}

TitleScreen.prototype = new Entity();
TitleScreen.prototype.constructor = TitleScreen;

TitleScreen.prototype.setGameOver = function() {
    if (this.gameEngine.win) this.animation = new Animation(AM.getAsset("./src/img/GameWin.jpg"), 1600, 900, 1, 9999, 1, false, 1.0 , null);
    else this.animation = new Animation(AM.getAsset("./src/img/GameOver.jpg"), 1600, 900, 1, 9999, 1, false, 1.0 , null);
    this.gameStarted = false;
    var that = this;
    var click = this.ctx.canvas.addEventListener("click", function () {
        that.gameEngine.reset(that, that.gameEngine.win);
    });
};

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
    if (!this.gameStarted) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, 0, 0);
        Entity.prototype.draw.call(this);
    }
};