/**
 * Created by asic on 5/22/2016.
 */
function TitleScreen(game, thegame){
    this.animation = AM.getAsset("./src/img/TitleScreen.jpg");
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
            that.gameEngine.showOutlines = false;

            var player = new Survivor(thegame, AM.getAsset("./src/img/survivor_handgun_idle_sprite.png"));
            that.gameEngine.player = player;
            that.gameEngine.reset(this, true);
            that.gameEngine.HUD = new HUD(that.gameEngine);
            that.gameEngine.ctx.canvas.addEventListener("resize", function (e) {
                that.gameEngine.ctx.canvas.width  = window.innerWidth;
                that.gameEngine.ctx.canvas.height = window.innerHeight;
            }, false);


            that.gameEngine.start("MainGame");
            that.ctx.canvas.removeEventListener("click", startGame);
        }
    };
    this.ctx.canvas.addEventListener("click", startGame);
}

TitleScreen.prototype = new Entity();
TitleScreen.prototype.constructor = TitleScreen;

TitleScreen.prototype.setGameOver = function() {
    if (this.gameEngine.win) {
        this.animation = AM.getAsset("./src/img/GameWin.jpg");
        this.gameEngine.level++;
    }
    else this.animation = AM.getAsset("./src/img/GameOver.jpg");
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

TitleScreen.prototype.draw = function () {
    if (!this.gameStarted) {
        this.ctx.drawImage(this.animation, 0, 0, 1200, 720);
        Entity.prototype.draw.call(this);
    }
};